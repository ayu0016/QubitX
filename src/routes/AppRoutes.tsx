import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";
import { GuestRoute } from "./GuestRoute";
import MainLayout from "../layouts/MainLayout";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import OnboardingPage from "../pages/OnboardingPage";
import DashboardPage from "../pages/DashboardPage";
import QuantumLabPage from "../pages/QuantumLabPage";
import CoursesPage from "../pages/CoursesPage";
import ChallengesPage from "../pages/ChallengesPage";
import ProgressPage from "../pages/ProgressPage";
import CommunityPage from "../pages/CommunityPage";
import ProfilePage from "../pages/ProfilePage";

const router = createBrowserRouter([
  // ─── Public ────────────────────────────────────────────────────────────────
  {
    path: "/",
    element: <LandingPage />,
  },

  // ─── Guest-only (redirect if already logged in) ─────────────────────────
  {
    element: <GuestRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignupPage /> },
    ],
  },

  // ─── Auth-required, onboarding (outside MainLayout) ────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/onboarding", element: <OnboardingPage /> },
    ],
  },

  // ─── Auth-required, main app shell ─────────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/dashboard",   element: <DashboardPage /> },
          { path: "/quantum-lab", element: <QuantumLabPage /> },
          { path: "/courses/*",     element: <CoursesPage /> },
          { path: "/course/*",      element: <CoursesPage /> },
          { path: "/challenges",  element: <ChallengesPage /> },
          { path: "/progress",    element: <ProgressPage /> },
          { path: "/community",   element: <CommunityPage /> },
          { path: "/profile",     element: <ProfilePage /> },
        ],
      },
    ],
  },

  // ─── Fallback ───────────────────────────────────────────────────────────
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;