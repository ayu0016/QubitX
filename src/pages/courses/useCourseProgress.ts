import { useState, useCallback, useEffect } from 'react';
import type { CourseData, LessonStatus } from './courseData';
import { INITIAL_COURSE_DATA } from './courseData';

const STORAGE_KEY = 'qubitx_course_progress_v1';
const COURSE_STATE_KEY = 'qubitx_course_state_v1';

export interface LessonProgress {
  status: LessonStatus;
  watchedSeconds: number; // furthest second reached
  checkpointsDone: string[]; // checkpoint ids completed
}

export interface CourseProgress {
  lessonProgress: Record<string, LessonProgress>;
}

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function getDefaultProgress(): LessonProgress {
  return { status: 'locked', watchedSeconds: 0, checkpointsDone: [] };
}

function loadCourse(): CourseData {
  try {
    const data = localStorage.getItem(COURSE_STATE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Error loading course state', e);
  }
  return deepCopy(INITIAL_COURSE_DATA);
}

function loadProgress(): Record<string, LessonProgress> {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data).lessonProgress || {};
  } catch (e) {
    console.error('Error loading progress', e);
  }
  return {};
}

function saveCourse(course: CourseData) {
  localStorage.setItem(COURSE_STATE_KEY, JSON.stringify(course));
}

function saveProgress(progress: Record<string, LessonProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ lessonProgress: progress }));
}

export function useCourseProgress() {
  const [course, setCourse] = useState<CourseData>(() => loadCourse());
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>(() => loadProgress());

  useEffect(() => { saveProgress(lessonProgress); }, [lessonProgress]);
  useEffect(() => { saveCourse(course); }, [course]);

  const updateLessonProgress = useCallback((lessonId: string, updates: Partial<LessonProgress>) => {
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: { ...getDefaultProgress(), ...prev[lessonId], ...updates }
    }));
  }, []);

  const completeLesson = useCallback((lessonId: string) => {
    setCourse(prev => {
      const next = deepCopy(prev);
      let didUpdate = false;
      for (const mod of next.modules) {
        for (const lesson of mod.lessons) {
          if (lesson.id === lessonId && lesson.status !== 'completed') {
            lesson.status = 'completed';
            didUpdate = true;
          }
        }
        if (didUpdate) {
          const lessonIdx = mod.lessons.findIndex(l => l.id === lessonId);
          if (lessonIdx >= 0 && lessonIdx + 1 < mod.lessons.length) {
            const nextLesson = mod.lessons[lessonIdx + 1];
            if (nextLesson.status === 'locked') {
              nextLesson.status = 'available';
            }
          }
        }
      }
      
      const m3 = next.modules.find(m => m.id === 'multi-qubit');
      const m4 = next.modules.find(m => m.id === 'advanced-algorithms');
      if (m3 && m4 && m3.lessons.every(l => l.status === 'completed')) {
        m4.locked = false;
        m4.lessons.forEach(l => { if (l.status === 'locked') l.status = 'available'; });
      }
      return next;
    });
    setLessonProgress(prev => ({
      ...prev,
      [lessonId]: { ...getDefaultProgress(), ...prev[lessonId], status: 'completed' }
    }));
  }, []);

  const markInProgress = useCallback((lessonId: string) => {
    setCourse(prev => {
      const next = deepCopy(prev);
      for (const mod of next.modules) {
        for (const lesson of mod.lessons) {
          if (lesson.id === lessonId && lesson.status === 'available') {
            lesson.status = 'in-progress';
          }
        }
      }
      return next;
    });
  }, []);

  return { course, lessonProgress, updateLessonProgress, completeLesson, markInProgress };
}
