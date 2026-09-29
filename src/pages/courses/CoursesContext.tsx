/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useCourseProgress } from './useCourseProgress';

type CourseContextType = ReturnType<typeof useCourseProgress>;

const CoursesContext = createContext<CourseContextType | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const progress = useCourseProgress();
  return <CoursesContext.Provider value={progress}>{children}</CoursesContext.Provider>;
}

export function useCoursesContext() {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error('useCoursesContext must be used within CoursesProvider');
  return ctx;
}
