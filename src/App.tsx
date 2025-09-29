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
import TemplatePlayground from "./pages/TemplatePlayground";
import "./App.css";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
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
          <Route path="/template-playground" element={<TemplatePlayground />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
