import { Link } from "react-router-dom";
import Dropdown from "./Dropdown";
import { useAuth } from "../auth/AuthContext";
import Button from "./ui-elements/Button";
import { useLogout } from "../hooks/useLogout";

export default function Navbar() {

    const { user } = useAuth();
    const doLogout = useLogout();

    // CV dropdown items 
    const cvItems = [
        <Link key="ex" to="/exemple-cv" > CV Examples </Link>,
        <Link key="md" to="/modele-cv"> CV Models </Link>,
    ];

    // Account dropdown items 
    const accountItems = user
        ? [
            <Link key="dash" to="/dashboard"> Dashboard </Link>,
            <Link key="profile" to="/profile" > Profile </Link>,
            <button key="logout" 
                onClick={() => doLogout({ confirm: true })}

            >
            Logout
            </button>,
        ]
        : [
            <Link key="login" to="/login" > Login </Link>,
            <Link key="signup" to="/signup" > Sign Up </Link>,
        ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-950/5">
        <nav className="w-full">
            <div className="h-16 w-full flex items-center justify-between px-4 sm:px-6">
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
                <Link to="/resume/new">
                    <Button>Create my resume</Button>  
                </Link>
            </div>
            </div>
        </nav>
        </header>
    );
}
