import React from "react";
import { render, fireEvent } from "@testing-library/react";
import BlogList from "./BlogList";
import "@testing-library/jest-dom";

describe("BlogList component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect BlogList to render", () => {
    let component = render(<BlogList />);
    expect(component.container).toBeInTheDocument();
  });
});