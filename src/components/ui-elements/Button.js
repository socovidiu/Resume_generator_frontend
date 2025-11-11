import { jsx as _jsx } from "react/jsx-runtime";
const Button = ({ variant = "primary", size = "md", className = "", children, ...props }) => {
    const baseStyles = "rounded-md shadow-md font-medium transition focus:outline-none";
    const variantStyles = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        navigation: "bg-orange-500 text-white hover:bg-orange-600",
    };
    const sizeStyles = {
        sm: "px-3 py-1 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-5 py-3 text-lg",
    };
    return (_jsx("button", { className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`, ...props, children: children }));
};
export default Button;
