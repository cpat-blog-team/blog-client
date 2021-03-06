import React from "react";
import { render, wait } from "@testing-library/react";
import ViewBlog from "./ViewBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    _id: 'G3J4K56M7J'
  })
}));

describe("ViewBlog component", () => {
  let component;
  let queriedRoute;

  beforeAll(() => {
    // mockAPI returns a mock blog and stores the queried route in the variable "queriedRoute" for testing
    axios.mockImplementation((route) => {
      queriedRoute = route;
      return Promise.resolve({ data: { blog: exampleBlogPost } });
    });
  });

  beforeEach(async (done) => {
		// component must be awaited because useEffect makes an api call up first render
		await wait(() => {
			component = render(
				<userContext.Provider value={{ name: exampleBlogPost.name }}>
					<ViewBlog />
				</userContext.Provider>
			);
		});
		done();
	});

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect ViewBlog to render", () => {
    expect(component.container).toBeInTheDocument();
  });

  test("should call api for blog post with passed down id from props", () => {
    expect(queriedRoute).toBe(`/api/blogs/${exampleBlogPost._id}`);
  });

  test("should render blog post", () => {
    expect(component.getByText(exampleBlogPost.title)).toBeInTheDocument();
  });
});