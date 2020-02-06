import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WriteBlog from "./WriteBlog";
import "@testing-library/jest-dom";

describe("WriteBlog component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect WriteBlog to render", () => {
    let component = render(<WriteBlog />);
    expect(component.container).toBeInTheDocument();
  });
 
  const exampleBlogPost = {
    title: 'Im Pickle Rick!!!',
    text: 'I turned myself into a pickle Morty!!!'
  }

  test("should be able to write blog title and text", () => {
    const utils = render(<WriteBlog />);

    //adds text to title input
    const title = utils.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    expect(title.value).toBe(exampleBlogPost.title);

    //add text to blog text area
    const text = utils.getByTestId('writeText');
    fireEvent.change(text, { target: { value: exampleBlogPost.text } });
    expect(text.value).toBe(exampleBlogPost.text);
  });

  test('should clear title and textarea upon submit', () => {
    const utils = render(<WriteBlog />);

    //adds text to title and textarea inputs
    const title = utils.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    const text = utils.getByTestId('writeText');
    fireEvent.change(text, { target: { value: exampleBlogPost.text } });

    //clicks submit button
    const submit = utils.getByTestId('submit');
    fireEvent.click(submit);

    expect(title.value).toBe('');
    expect(text.value).toBe('');
  });
});