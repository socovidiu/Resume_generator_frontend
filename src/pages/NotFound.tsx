import React from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600">404</h1>
      <p className="text-lg text-gray-700">Oops! Page not found.</p>
      <Link to="/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
