import React from "react";
import { render, wait } from "@testing-library/react";
import ViewBlog from "./ViewBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';
import mockAxios from 'axios';

jest.mock('axios');

describe("ViewBlog component", () => {
  let component;
  let queriedRoute;

  beforeAll(() => {
    // mockAPI returns a mock blog and stores the queried route in the variable "queriedRoute" for testing
    const mockApi = (route) => {
      queriedRoute = route;
      return Promise.resolve({ data: { blog: exampleBlogPost } });
    };
    mockAxios.mockImplementation(mockApi);
  });

  beforeEach(async () => {
    // component must be awaited because useEffect makes an api call upon first render
    await wait(() => {
      component = render(<ViewBlog location={{ state: { _id: exampleBlogPost._id } }} />);
    });
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect ViewBlog to render", () => {
    expect(component.container).toBeInTheDocument();
  });

  test("should call api for blog post with passed down id from props", () => {
    expect(queriedRoute).toBe(`/blogs/${exampleBlogPost._id}`);
  });

  test("should render blog post", () => {
    expect(component.getByText(exampleBlogPost.title)).toBeInTheDocument();
  });
});