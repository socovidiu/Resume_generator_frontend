import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import GuestRoute from "./auth/GuestRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CvEditPage from "./pages/CvEditPage";
import CvManager from "./pages/CvManagerPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import AuthLayout from "./layouts/AuthLayout";



function Shell({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Any paths that should be edge-to-edge (no gray container)
  const edgeToEdge = [
    "/login",
    "/signup",
    "/dashboard",
    "/profile",
    // add more like "/forgot-password" if you add them later
  ].some((pattern) => matchPath({ path: pattern, end: true }, location.pathname));

  return (
    <>
      <Navbar />
      {edgeToEdge ? (
        // No container / gray background on auth pages
        <div className="min-h-[calc(100vh-4rem)]">{children}</div>
      ) : (
        // Default app shell
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">{children}</div>
        </div>
      )}
    </>
  );
}


export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<GuestRoute redirectTo="/" />}>
          <Route
            path="/login"
            element={
              <AuthLayout title="Welcome back" blurb="Pick up where you left off.">
                <LoginPage />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout title="Create your account" blurb="It takes less than a minute.">
                <SignupPage />
              </AuthLayout>
            }
          />
        </Route>

        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resume" element={<DashboardPage />} />
          <Route path="/resumes" element={<CvManager />} />
          <Route path="/resume/new" element={<CvEditPage />} />
          <Route path="/resume/:id" element={<CvEditPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
