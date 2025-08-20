import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

 
    // Handle Logout with Confirmation
    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            setIsLoggingOut(true);
            logout();
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
              <p className="text-lg text-gray-700 animate-pulse">Loading user data...</p>
            </div>
        );
    }

    return (
      <div className="container mx-auto p-6 max-w-md bg-white shadow-lg rounded-lg">
        {/* Profile Picture */}
        <div className="flex flex-col items-center"> 
          <h1 className="text-2xl font-semibold mt-3">{user.username}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
  
        {/* Actions */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={() => navigate("/settings")}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 "
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full mt-2  ${
              isLoggingOut ? " cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            } text-white`}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    );
};

export default Dashboard;