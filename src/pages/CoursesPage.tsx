import { Routes, Route } from 'react-router-dom';
import { CoursesProvider } from './courses/CoursesContext';
import CourseContentPage from './courses/CourseContentPage';
import LecturePage from './courses/LecturePage';

export default function CoursesPage() {
  return (
    <CoursesProvider>
      <Routes>
        <Route index element={<CourseContentPage />} />
        <Route path="lesson/:lessonId" element={<LecturePage />} />
      </Routes>
    </CoursesProvider>
  );
}
