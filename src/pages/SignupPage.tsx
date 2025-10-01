import React from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/forms/SignupForm";

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-sm text-gray-600 mt-1">It takes less than a minute.</p>
      </div>

      <SignupForm />

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-indigo-600 hover:underline"
        >
          Log in
        </button>
      </p>
    </>
  );
};

export default SignupPage;
