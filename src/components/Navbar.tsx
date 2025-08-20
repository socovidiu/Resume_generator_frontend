import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {

    const { user, clearSession } = useAuth();
    const navigate = useNavigate();

    // CV dropdown items (blue text)
    const cvItems = [
        <Link key="ex" to="/exemple-cv" className="block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        CV Examples
        </Link>,
        <Link key="md" to="/modele-cv" className="block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
        CV Models
        </Link>,
    ];

    // Account dropdown items (blue text)
    const accountItems = user
        ? [
            <Link key="dash" to="/cvs" className="block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Dashboard
            </Link>,
            <Link key="profile" to="/profile" className="block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Profile
            </Link>,
            <button
            key="logout"
            onClick={() => {
                clearSession();
                navigate("/login");
            }}
            className="w-full text-left px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
            Logout
            </button>,
        ]
        : [
            <Link key="login" to="/login" className="block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Login
            </Link>,
            <Link key="signup" to="/signup" className="block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
            Sign Up
            </Link>,
        ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-950/5">
        <nav className="px-4 sm:px-6">
            <div className="mx-auto max-w-7xl h-16 flex items-center justify-between">
            {/* Left: logo */}
            <Link to="/" className="flex items-center gap-2">
                <img
                alt="cvapp.ro logo"
                src="logo.svg"
                className="h-7 sm:h-9"
                />
            </Link>

        

            {/* Right: account + CTA */}
            <div className="flex items-center gap-4">

                {/* CV templates dropdown */}
                <Dropdown
                button={
                    <span className="inline-flex items-center gap-1 font-medium text-gray-900 hover:text-blue-500">
                    Resume Templates
                    </span>
                }
                items={cvItems}
                />
                
                {/* divider like screenshot */}
                <span className="hidden sm:block h-6 w-px bg-gray-200" />

                {/* Sign in (blue text) OR Account dropdown */}
                {user ? (
                <Dropdown
                    button={
                    <span className="font-medium text-gray-900 hover:text-blue-700">
                        My Account ({user.username})
                    </span>
                    }
                    items={accountItems}
                    align="right"
                />
                ) : (
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                    Sign in
                </Link>
                )}

                {/* Primary CTA */}
                <Link to="/create-resume">
                <button className="bg-blue-500 text-white font-semibold px-4 sm:px-5 py-2 rounded-lg hover:bg-blue-600 transition">
                    Create my resume
                </button>
                </Link>
            </div>
            </div>
        </nav>
        </header>
    );
}
