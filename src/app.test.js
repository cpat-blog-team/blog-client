import React from "react";
import { render } from "@testing-library/react";
import App from "./app";
import "@testing-library/jest-dom";
import { BrowserRouter } from 'react-router-dom';


describe("App component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect app to render", () => {
    let component = render(<BrowserRouter><App /></BrowserRouter>);
    expect(component.container).toBeInTheDocument();
  });
});
