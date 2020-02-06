import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WriteBlog from "./WriteBlog";
import "@testing-library/jest-dom";
import exampleBlogPost from './exampleBlogPost';

describe("WriteBlog component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect WriteBlog to render", () => {
    let component = render(<WriteBlog />);
    expect(component.container).toBeInTheDocument();
  });

  test("should be able to write blog title and text", () => {
    const utils = render(<WriteBlog />);

    //adds text to title input
    const title = utils.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    expect(title.value).toBe(exampleBlogPost.title);

    //add text to blog text area
    const content = utils.getByTestId('writeText');
    fireEvent.change(content, { target: { value: exampleBlogPost.content } });
    expect(content.value).toBe(exampleBlogPost.content);
  });

  test('should clear title and textarea upon submit', () => {
    const utils = render(<WriteBlog />);

    //adds text to title and textarea inputs
    const title = utils.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    const content = utils.getByTestId('writeText');
    fireEvent.change(content, { target: { value: exampleBlogPost.content } });

    //clicks submit button
    const submit = utils.getByTestId('submit');
    fireEvent.click(submit);

    expect(title.value).toBe('');
    expect(content.value).toBe('');
  });
});