import React from "react";
import { render, wait, fireEvent } from "@testing-library/react";
import { exampleList, exampleBlogPost } from './exampleBlogPost'
import BlogList from "./BlogList";
import "@testing-library/jest-dom";
import axiosMock from 'axios';

jest.mock('axios');

describe('BlogList component', () => {
  let component;
  let queriedRoute;

  beforeAll(() => {
    // this mock api call will store the route its invoke with and store it in the var "queriedRoute" for testing
    const mockApi = (route) => {
      queriedRoute = route;
      return Promise.resolve({ data: { blogs: exampleList(5) } });
    };
    axiosMock.mockImplementation(mockApi);
  });

  beforeEach(async () => {
    // component must be awaited because useEffect makes an api call up first render
    await wait(async () => {
      component = await render(<BlogList />);
    });
  });

  test('canary test', () => {
    expect(true).toEqual(true);
  });

  test('expect BlogList to render', () => {
    expect(component.container).toBeInTheDocument();
  });

  test('use effect should call api and set state with response', () => {
    expect(component.getByTestId('blogPost0')).toBeInTheDocument();
    expect(component.getByTestId('blogPost1')).toBeInTheDocument();
    expect(component.getByTestId('blogPost2')).toBeInTheDocument();
    expect(component.getByTestId('blogPost3')).toBeInTheDocument();
    expect(component.getByTestId('blogPost4')).toBeInTheDocument();
  });

  test('should search by title when search button is clicked', async () => {
    //adds text to search input
    const searchInput = component.getByTestId('search-input');
    await wait(() => fireEvent.change(searchInput, { target: { value: exampleBlogPost.title } }));

    //clicks search button to trigger api searc call
    const searchButton = component.getByTestId('search-button');
    await wait(() => fireEvent.click(searchButton));

    // "queriedRoute" is stored in the global scope of this describe block
    //  - it is updated by the mock axios call so that we can test it here
    expect(queriedRoute).toEqual(`/search?title=${exampleBlogPost.title}`);
  });
});