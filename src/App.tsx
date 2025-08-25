import { Routes, Route, Navigate } from "react-router-dom";
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
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto mt-20 max-w-screen-lg bg-gray-200 p-6 rounded-lg shadow-md">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<GuestRoute redirectTo="/" />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Route>

          <Route element={<ProtectedRoute redirectTo="/login" />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/cvs" element={<DashboardPage />} />
            <Route path="/managecvs" element={<CvManager />} />
            <Route path="/cvs/new" element={<CvEditPage />} />
            <Route path="/cvs/:id" element={<CvEditPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
