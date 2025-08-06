import React, { useState, useRef } from "react";

const Navbar: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);


    return (
        <header>
            <nav className="flex flex-wrap items-center justify-between px-6 border-b border-gray-950/5 dark:border-white/10 ">
                <div className="container mx-auto flex items-center justify-between ">
                    {/* Logo */}
                    <a href="/" className="flex-shrink-0">
                        <img
                            alt="cvapp.ro logo"
                            src="https://s3.resume.io/uploads/country/logo_default/180/cvapp.ro_black__3_.svg"
                            className="h-10"
                        />
                    </a>

                    {/* Desktop Navigation */}
                    <div className="flex items-center space-x-6">
                        {/* CV Dropdown */}
                        <div
                            className="relative dropdown-menu"
                            ref={dropdownRef}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            <button className="flex items-center text-gray-800 hover:text-blue-500 px-4 py-2">
                                SELCET CV
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="ml-1 h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.8 7l4.2 4 4.2-4 1.4 1.4-5.6 5.6-5.6-5.6L5.8 7z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Content */}
                            {dropdownOpen && (
                                <div className="dropdown-content">
                                    <a href="/exemple-cv">CV Exemples</a>
                                    <a href="/modele-cv">CV Models</a>
                                </div>
                            )}
                        </div>

                        {/* Other Links */}
                        <a className="text-gray-800 hover:text-blue-500 px-4 py-2" href="/app/auth/sign-in">
                            My Account
                        </a>

                        <a href="/app/create-resume">
                            <button className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 transition">
                                Create CV
                            </button>
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
