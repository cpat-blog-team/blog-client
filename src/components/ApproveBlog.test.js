import React from "react";
import { render, wait, fireEvent } from "@testing-library/react";
import ApproveBlog from "./ApproveBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';
import mockAxios from 'axios';

jest.mock('axios');

let pushedRoute;

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: (route) => pushedRoute = route,
  }),
  useParams: () => ({
    _id: 'G3J4K56M7J'
  })
}));

describe("ApproveBlog component", () => {
  let component;
  let queriedRoute;

  const mockHistory = {
    push: (route) => (pushedRoute = route),
    location: {},
    listen: jest.fn()
  };


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
      component = render(
        <ApproveBlog />
      );
    });
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect ApproveBlog to render", () => {
    expect(component.container).toBeInTheDocument();
  });

  test("should call api for blog post with passed down id from props", () => {
    expect(queriedRoute).toBe(`/api/blogs/${exampleBlogPost._id}`);
  });

  test("should render blog post", () => {
    expect(component.getByText(exampleBlogPost.title)).toBeInTheDocument();
  });

  test("should render review button and modal", () => {
    const { getByTestId } = component;
    getByTestId('review-button');
    getByTestId('review-modal');
  });

  xtest('should make post request to endpoint "/blogs/update" and pass the id in the body', async (done) => {
    const { getByTestId, getByText } = component;

    // updates valued for review modal select and comments
    const reviewStatus = getByTestId('review-status');
    fireEvent.change(reviewStatus, { target: { value: "Approved" } });
    const reviewComments = getByTestId('review-comments');
    fireEvent.change(reviewComments, { target: { value: "lgtm" } });

    // clicks submit review button
    const submit = getByText('Submit');
    await wait(() => fireEvent.click(submit));

    expect(queriedRoute).toBe('/blogs/update');
    done();
  });
});