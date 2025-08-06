import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CvManager from "./pages/CvManager";
import Navbar from "./components/Navbar";
import "./App.css";

const App: React.FC = () => {

   
    return (
        <div className="min-h-screen min-w-screen flex flex-col ">
            {/* Navbar */}
            <Navbar />

            {/* Content Wrapper (with top padding to prevent overlap) */}
            <div className="flex-grow container mx-auto mt-20 max-w-screen-lg bg-gray-200 p-6 rounded-lg shadow-md">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cvs" element={<CvManager />} />
                </Routes>
            </div>
        </div>
       
    );
};

export default App;
