import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
test("renders home page headline", () => {
    render(_jsx(Home, {}));
    expect(screen.getByText(/Resume Generator/i)).toBeInTheDocument();
});
