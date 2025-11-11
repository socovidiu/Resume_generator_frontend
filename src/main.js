import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(_jsx(StrictMode, { children: _jsx(AuthProvider, { children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }));
