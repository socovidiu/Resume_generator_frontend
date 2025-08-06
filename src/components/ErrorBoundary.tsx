import React from "react";

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.error("🚨 Error in a component:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return <div className="text-center text-red-500 font-bold">⚠️ Something went wrong. Please try again.</div>;
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
