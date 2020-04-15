import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import WriteBlog from "./WriteBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';
import mockAxios from 'axios';

jest.mock('axios');
jest.mock('quill/dist/quill.snow.css', () => jest.fn());

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({ _id: null })
}));

describe("WriteBlog component", () => {
  let queriedRoute;
  let postedData;
  let component;

  beforeAll(() => {
    window.document.getSelection = () => ({
      getRangeAt: () => { }
    })

    mockAxios.post.mockImplementation((route, data) => {
      queriedRoute = route;
      postedData = JSON.parse(data);
      return Promise.resolve();
    });
  });

  beforeEach(() => {
    component = render(<WriteBlog />);
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect WriteBlog to render", () => {
    expect(component.container).toBeInTheDocument();
  });

  test("should be able to write blog title, summary and content", () => {
    const { getByTestId } = component;
    //adds text to title input
    const title = getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    expect(title.value).toBe(exampleBlogPost.title);

    //add text to summary input
    const summary = getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });
    expect(summary.value).toBe(exampleBlogPost.summary);
  });

  test('should clear title, summary and content upon submit', async () => {
    const { getByTestId } = component;
    //adds text to title, summary and content inputs
    const title = getByTestId('writeTitle');
    await wait(() => fireEvent.change(title, { target: { value: exampleBlogPost.title } }));
    const summary = getByTestId('writeSummary');
    await wait(() => fireEvent.change(summary, { target: { value: exampleBlogPost.summary } }));

    //clicks submit button
    const submit = getByTestId('submit');
    await wait(() => fireEvent.click(submit));

    //clicks accept button in community guidelines modal
    const modal = getByTestId('community-guidelines-modal');
    const accept = modal.children[1].children[2].children[1];
    await wait(() => fireEvent.click(accept));

    expect(title.value).toBe('');
    expect(summary.value).toBe('');
  });

  test('should make post request to route /api/blogs/add upon submit (body should include fields title, summary and content)', async () => {
    const { getByTestId } = component;
    //adds text to title, summary and content inputs
    const title = getByTestId('writeTitle');
    await wait(() => fireEvent.change(title, { target: { value: exampleBlogPost.title } }));
    const summary = getByTestId('writeSummary');
    await wait(() => fireEvent.change(summary, { target: { value: exampleBlogPost.summary } }));

    //clicks submit button
    const submit = getByTestId('submit');
    await wait(() => fireEvent.click(submit));

    //clicks accept button in community guidelines modal
    const modal = getByTestId('community-guidelines-modal');
    const accept = modal.children[1].children[2].children[1];
    await wait(() => fireEvent.click(accept));

    expect(postedData.title).toEqual(exampleBlogPost.title);
    expect(postedData.summary).toEqual(exampleBlogPost.summary);
    expect(queriedRoute).toBe('/api/blogs/add');
  });

  test('should render not render update community guidelines switch when user does not have update_guidelines role', () => {
    const { queryByTestId } = component;
    expect(queryByTestId('update-community-guidelines-toggle-toggle')).toBe(null);
  });
});
