import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import { exampleBlogPost } from './exampleBlogPost'
import SearchBlog from "./SearchBlog";
import "@testing-library/jest-dom";

let pushedHistory;

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: (value) => pushedHistory = value,
  }),
  useParams: () => ({})
}));

describe("SearchBlog component", () => {
  let component;

  beforeEach(() => {
    component = render(<SearchBlog />);
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect SearchBlog to render", async () => {
    expect(component.container).toBeInTheDocument();
  });

  test("expect search bar to clear once blog is searched", async () => {
    //adds text to search input and submits 
    const searchInput = component.getByTestId('search-input');
    await wait(() => fireEvent.change(searchInput, { target: { value: 'some blog title' } }));
    await wait(() => fireEvent.submit(searchInput));

    expect(searchInput.value).toBe('');
  });

  test('should push title to history when searched', async () => {
    //adds text to search input and submits 
    const searchInput = component.getByTestId('search-input');
    await wait(() => fireEvent.change(searchInput, { target: { value: exampleBlogPost.title } }));
    await wait(() => fireEvent.submit(searchInput));

    // "pushedHistory" is stored in the global scope of this test
    //  - it is updated by the jest.mock of the useHistory from the react-router-dom library
    expect(pushedHistory).toEqual(`/blogList/${exampleBlogPost.title}`);
  });
});