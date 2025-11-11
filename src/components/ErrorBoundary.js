import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error("🚨 Error in a component:", error, info);
    }
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { className: "text-center text-red-500 font-bold", children: "\u26A0\uFE0F Something went wrong. Please try again." }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
