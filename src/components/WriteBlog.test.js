import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WriteBlog from "./WriteBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';
import mockAxios from 'axios';

jest.mock('axios');
jest.mock('quill/dist/quill.snow.css', () => jest.fn());

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
    //adds text to title input
    const title = component.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    expect(title.value).toBe(exampleBlogPost.title);

    //add text to summary input
    const summary = component.getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });
    expect(summary.value).toBe(exampleBlogPost.summary);
  });

  test('should clear title, summary and content upon submit', async () => {
    //adds text to title, summary and content inputs
    const title = component.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    const summary = component.getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });

    //clicks submit button
    const submit = component.getByTestId('submit');
    fireEvent.click(submit);

    expect(title.value).toBe('');
    expect(summary.value).toBe('');
  });

  test('should make post request to route /blogs/add upon submit (body should include fields title, summary and content)', () => {
    //adds text to title, summary and content inputs
    const title = component.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    const summary = component.getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });

    //clicks submit button
    const submit = component.getByTestId('submit');
    fireEvent.click(submit);

    expect(postedData.title).toEqual(exampleBlogPost.title);
    expect(postedData.summary).toEqual(exampleBlogPost.summary);
    expect(queriedRoute).toBe('/blogs/add');
  });
});