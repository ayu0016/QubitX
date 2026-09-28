import { Routes, Route } from 'react-router-dom';
import { CoursesProvider } from './courses/CoursesContext';
import CourseContentPage from './courses/CourseContentPage';
import LecturePage from './courses/LecturePage';

export default function CoursesPage() {
  return (
    <CoursesProvider>
      <Routes>
        <Route index element={<CourseContentPage />} />
        <Route path="module/:moduleId" element={<CourseContentPage />} />
        <Route path="lesson/:lessonId" element={<LecturePage />} />
        <Route path="lesson/:lessonId/checkpoint/:checkpointId" element={<LecturePage />} />
      </Routes>
    </CoursesProvider>
  );
}
