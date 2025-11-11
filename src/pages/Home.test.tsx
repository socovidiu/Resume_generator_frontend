import { render, screen } from "@testing-library/react";
import Home from "./Home";

test("renders home page headline", () => {
  render(<Home />);
  expect(
    screen.getByText(/Resume Generator/i)
  ).toBeInTheDocument();
});