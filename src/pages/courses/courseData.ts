export type LessonStatus = 'completed' | 'in-progress' | 'available' | 'locked';
export type LessonType = 'lecture' | 'challenge';

export interface Checkpoint {
  id: string;
  time: number; // seconds into video
  question: string;
  context?: string; // e.g. "The first qubit was measured as 0."
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  durationMin: number;
  status: LessonStatus;
  description?: string;
  videoSrc?: string; // URL - easy to replace later
  videoPoster?: string;
  checkpoints?: Checkpoint[];
  chapters?: VideoChapter[];
}

export interface Module {
  id: string;
  number: string; // '01', '02', etc.
  title: string;
  description: string;
  locked: boolean;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  title: string;
  subtitle: string;
  modules: Module[];
}

export const INITIAL_COURSE_DATA: CourseData = {
  id: 'quantum-foundations',
  title: 'Course Content',
  subtitle: 'Quantum Computing Foundations',
  modules: [
    {
      id: 'fundamentals',
      number: '01',
      title: 'Quantum Fundamentals',
      description: 'Build the mental model for qubits, states, and measurement.',
      locked: false,
      lessons: [
        { id: 'qubits-and-quantum-states', title: 'Qubits and Quantum States', type: 'lecture', durationMin: 12, status: 'completed' },
        { id: 'measurement-basics', title: 'Measurement Basics', type: 'lecture', durationMin: 10, status: 'completed' }
      ]
    },
    {
      id: 'quantum-gates',
      number: '02',
      title: 'Quantum Gates',
      description: 'Learn how gates transform the state of a qubit.',
      locked: false,
      lessons: [
        { id: 'pauli-gates', title: 'Pauli Gates', type: 'lecture', durationMin: 11, status: 'completed' },
        { 
          id: 'hadamard-gate', 
          title: 'Hadamard Gate', 
          type: 'lecture', 
          durationMin: 14, 
          status: 'in-progress',
          description: 'Learn how gates transform the state of a qubit.',
          videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
          chapters: [
            { id: 'ch1', title: 'Introduction', startTime: 0, endTime: 2 },
            { id: 'ch2', title: 'Hadamard Transform', startTime: 2, endTime: 4 },
            { id: 'ch3', title: 'Superposition States', startTime: 4, endTime: 6 },
            { id: 'ch4', title: 'Applications', startTime: 6, endTime: 8 },
            { id: 'ch5', title: 'Summary', startTime: 8, endTime: 9 },
          ],
          checkpoints: [
            {
              id: 'cp1', time: 3,
              question: 'What does the Hadamard gate produce when applied to |0⟩?',
              options: ['A superposition of |0⟩ and |1⟩', 'Pure |1⟩ state', 'No change to the qubit'],
              correctIndex: 0,
              explanation: 'The Hadamard gate H places a qubit in an equal superposition: H|0⟩ = (|0⟩ + |1⟩)/√2'
            },
            {
              id: 'cp2', time: 6,
              question: 'Which property makes the Hadamard gate its own inverse?',
              options: ['H² = I (the identity)', 'H² = X (bit flip)', 'H² = Z (phase flip)'],
              correctIndex: 0,
              explanation: 'The Hadamard gate is self-inverse: applying it twice returns the qubit to its original state.'
            }
          ]
        },
        { id: 'phase-gates', title: 'Phase Gates', type: 'lecture', durationMin: 9, status: 'available' }
      ]
    },
    {
      id: 'multi-qubit',
      number: '03',
      title: 'Multi-Qubit Systems',
      description: 'See how entanglement creates correlated measurement outcomes.',
      locked: false,
      lessons: [
        { 
          id: 'entanglement-bell-states', 
          title: 'Entanglement & Bell States', 
          type: 'lecture', 
          durationMin: 14, 
          status: 'in-progress',
          description: 'Understand how entangled qubits behave and why their measurement outcomes are correlated.',
          videoSrc: 'https://www.w3schools.com/html/mov_bbb.mp4',
          chapters: [
            { id: 'ch1', title: 'Introduction to Entanglement', startTime: 0, endTime: 2 },
            { id: 'ch2', title: 'Creating a Bell State', startTime: 2, endTime: 4 },
            { id: 'ch3', title: 'Measurement Correlation', startTime: 4, endTime: 6 },
            { id: 'ch4', title: 'Bell State Simulation', startTime: 6, endTime: 8 },
            { id: 'ch5', title: 'Summary', startTime: 8, endTime: 9 },
          ],
          checkpoints: [
            {
              id: 'cp1', time: 4,
              context: 'The first qubit was measured as 0.',
              question: 'What should the second qubit most likely measure?',
              options: ['0, because the pair is correlated', '1, because the pair is opposite', 'Either value with equal probability'],
              correctIndex: 0,
              explanation: 'The Bell state creates correlated measurement outcomes. If the first qubit is measured as 0, the second qubit is expected to measure 0 as well.'
            },
            {
              id: 'cp2', time: 8,
              question: 'What operation creates the initial superposition in the Bell state circuit?',
              options: ['Hadamard gate', 'Measurement', 'CNOT only'],
              correctIndex: 0,
              explanation: 'The Hadamard gate places the first qubit into superposition, after which the CNOT gate entangles both qubits.'
            }
          ]
        },
        { id: 'measurement-correlation', title: 'Measurement Correlation', type: 'lecture', durationMin: 9, status: 'locked' },
        { id: 'module-assignment', title: 'Module Assignment', type: 'challenge', durationMin: 8, status: 'locked' }
      ]
    },
    {
      id: 'advanced-algorithms',
      number: '04',
      title: 'Advanced Algorithms',
      description: 'Apply your foundations to algorithms with a quantum advantage.',
      locked: true,
      lessons: [
        { id: 'deutsch-jozsa', title: 'Deutsch-Jozsa', type: 'lecture', durationMin: 15, status: 'locked' },
        { id: 'grovers-algorithm', title: "Grover's Algorithm", type: 'lecture', durationMin: 20, status: 'locked' }
      ]
    }
  ]
};

export function getLessonById(course: CourseData, lessonId: string): { lesson: Lesson; module: Module } | null {
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      if (lesson.id === lessonId) return { lesson, module };
    }
  }
  return null;
}

export function getPrevNextLessons(course: CourseData, lessonId: string): { prev: Lesson | null; next: Lesson | null } {
  const allLessons = course.modules.flatMap(m => m.lessons);
  const idx = allLessons.findIndex(l => l.id === lessonId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null
  };
}

export function computeModuleProgress(mod: Module): number {
  if (mod.lessons.length === 0) return 0;
  const completed = mod.lessons.filter(l => l.status === 'completed').length;
  return Math.round((completed / mod.lessons.length) * 100);
}

export function computeCourseProgress(course: CourseData): { completed: number; total: number; pct: number } {
  const allLessons = course.modules.flatMap(m => m.lessons);
  const total = allLessons.length;
  const completed = allLessons.filter(l => l.status === 'completed').length;
  return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
}

export function getCurrentLesson(course: CourseData): Lesson | null {
  const allLessons = course.modules.flatMap(m => m.lessons);
  const inProgress = allLessons.find(l => l.status === 'in-progress');
  if (inProgress) return inProgress;
  const available = allLessons.find(l => l.status === 'available');
  if (available) return available;
  return null;
}
