import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui-elements/Button"

const Home: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-white">
            <motion.h1 
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              🚀 CV Generator
            </motion.h1>
            <p className="text-lg opacity-80 text-center max-w-lg">
                Create, edit, and manage your CVs with ease. Start building your professional career today!
            </p>

            <div className="mt-8 flex justify-between w-full max-w-screen-lg px-8">
                <a href="/cvs">
                    <Button>Manage CVs</Button>
                </a>
                <a href="/about">
                    <Button>Learn More</Button> 
                </a>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-10 left-1/4 w-32 h-32 bg-white opacity-10 rounded-full animate-pulse"></div>
                <div className="absolute bottom-10 right-1/3 w-20 h-20 bg-white opacity-15 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};

export default Home;
