import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthContext"; // <- make sure this is exported

function renderWithProviders(ui: React.ReactNode, initialEntries = ["/"]) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </AuthProvider>
  );
}

test("navigates to Home by default", () => {
  renderWithProviders(<App />, ["/"]);
  expect(screen.getByText(/Resume Generator/i)).toBeInTheDocument();
});

test("shows login page when path is /login", () => {
  renderWithProviders(<App />, ["/login"]);
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});
