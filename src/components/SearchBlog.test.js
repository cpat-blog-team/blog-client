import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { exampleBlogPost } from './exampleBlogPost'
import SearchBlog from "./SearchBlog";
import "@testing-library/jest-dom";

describe("SearchBlog component", () => {
  let component;
  let searchedTitle;

  beforeEach(() => {
    const search = (title) => searchedTitle = title;
    component = render(<SearchBlog search={search} />);
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });


  test("expect SearchBlog to render", async () => {
    expect(component.container).toBeInTheDocument();
  });

  test('should invoke search function passed in from props with title to search', async () => {
    //adds text to search input
    const searchInput = component.getByTestId('search-input');
    await wait(() => fireEvent.change(searchInput, { target: { value: exampleBlogPost.title } }));
    //clicks search button
    const searchButton = component.getByTestId('search-button');
    await wait(() => fireEvent.click(searchButton));

    expect(searchedTitle).toBe(exampleBlogPost.title);
  });
  test("expect search bar to clear once blog is searched", async () => {
    //adds text to search input
    const searchInput = component.getByTestId('search-input');
    await wait(() => fireEvent.change(searchInput, { target: { value: 'some blog title' } }));
    //clicks search button
    const searchButton = component.getByTestId('search-button');
    await wait(() => fireEvent.click(searchButton));

    expect(searchInput.value).toBe('');
  });
});