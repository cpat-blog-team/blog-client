import React from "react";
import { render, fireEvent } from "@testing-library/react";
import ViewBlog from "./ViewBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';

describe("WriteBlog component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect WriteBlog to render", () => {
    let component = render(<ViewBlog />);
    expect(component.container).toBeInTheDocument();
  });
});