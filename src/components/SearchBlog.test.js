import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { exampleBlogPost } from './exampleBlogPost'
import SearchBlog from "./SearchBlog";
import "@testing-library/jest-dom";


describe("SearchBlog component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });


  test("expect SearchBlog to render", () => {
    let component = render(<SearchBlog />);
    expect(component.container).toBeInTheDocument();
  });

  test("expect search bar to clear once blog is searched", () => {
    const component = render(<SearchBlog search={() => { }} />);

    //adds text to search input
    const searchInput = component.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'some blog title' } });

    //clicks search button
    const searchButton = component.getByTestId('search-button');
    fireEvent.click(searchButton);

    expect(searchInput.value).toBe('');
  });

  test('expect component to invoke search function from props with searched value', () => {
    let searchedTitle;
    //stores searched value in searchedTitle variable for testing
    const search = (data) => searchedTitle = data;
    const component = render(<SearchBlog search={search} />);

    //adds title from exampleBlogPost to search input
    const searchInput = component.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: exampleBlogPost.title } });

    //clicks search button
    const searchButton = component.getByTestId('search-button');
    fireEvent.click(searchButton);

    expect(searchedTitle).toEqual(exampleBlogPost.title);
  });
});