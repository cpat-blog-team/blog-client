import React from "react";
import { render } from "@testing-library/react";
import BlogList from "./BlogList";
import "@testing-library/jest-dom";

describe("BlogList component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect BlogList to render", () => {
    const component = render(<BlogList />);
    expect(component.container).toBeInTheDocument();
  });

  test("should call api for blogs and render with response", () => {
    const component = render(<BlogList />);
    const title = component.getByTestId('blogPost0');
    expect(title).toBeInTheDocument();
  });
});