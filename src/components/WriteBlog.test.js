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

  const exampleBlog = {
    title: 'Im Pickle Rick!!!',
    username: 'Morty',
    text: 'I turned myself into a pickle Morty!!!'
  }

  test("should be able to write blog title and text", () => {
    const utils = render(<WriteBlog />);

    //adds text to title input
    const title = utils.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlog.title } });
    expect(title.value).toBe(exampleBlog.title);

    //add text to blog text area
    const blogPostText = utils.getByTestId('writeBlogPostText');
    fireEvent.change(blogPostText, { target: { value: exampleBlog.text } });
    expect(blogPostText.value).toBe(exampleBlog.text);
  });

  test("should be able to submit blog post", () => {
    //stores submited value in variable submitOutput for testing
    let submitOutput = null;
    const handleSubmit = (blogPost) => submitOutput = blogPost;
    const utils = render(<WriteBlog handleSubmit={handleSubmit} username="Morty"/>);

    //populates blog with title and blogPost text
    const title = utils.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlog.title } });
    const blogPostText = utils.getByTestId('writeBlogPostText');
    fireEvent.change(blogPostText, { target: { value: exampleBlog.text } });

    //clicks submit button
    const submit = utils.getByTestId('submit');
    fireEvent.click(submit);

    expect(submitOutput).toEqual(exampleBlog);
  });
});