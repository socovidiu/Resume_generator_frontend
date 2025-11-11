import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext"; // <- make sure this is exported
function renderWithProviders(ui, initialEntries = ["/"]) {
    return render(_jsx(AuthProvider, { children: _jsx(MemoryRouter, { initialEntries: initialEntries, children: ui }) }));
}
test("navigates to Home by default", () => {
    renderWithProviders(_jsx(App, {}), ["/"]);
    expect(screen.getByText(/Resume Generator/i)).toBeInTheDocument();
});
test("shows login page when path is /login", () => {
    renderWithProviders(_jsx(App, {}), ["/login"]);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
