import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-sm text-gray-600 mt-1">Welcome back — let’s get to work.</p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/signup")}
          className="text-indigo-600 hover:underline"
        >
          Create one
        </button>
      </p>
    </>
  );
};

export default LoginPage;
