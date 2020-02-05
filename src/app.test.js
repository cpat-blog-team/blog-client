import React from "react";
import { render } from "@testing-library/react";
import App from "./app";
import "@testing-library/jest-dom";

describe("App component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect app to render", () => {
    let component = render(<App />);
    expect(component.container).toBeInTheDocument();
  });
});
