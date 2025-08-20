import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-center mb-4">Login</h2>
      <LoginForm />
      <div className="text-center mt-4">
        <p className="text-gray-600">Don't have an account?</p>
        <button
          onClick={() => navigate("/signup")}
          className="text-blue-500 hover:underline"
          type="button"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
