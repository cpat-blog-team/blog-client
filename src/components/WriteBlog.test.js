import React from "react";
import { render, fireEvent } from "@testing-library/react";
import WriteBlog from "./WriteBlog";
import "@testing-library/jest-dom";
import { exampleBlogPost } from './exampleBlogPost';
import mockAxios from 'axios';

jest.mock('axios');

describe("WriteBlog component", () => {
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect WriteBlog to render", () => {
    let component = render(<WriteBlog />);
    expect(component.container).toBeInTheDocument();
  });

  test("should be able to write blog title, summary and content", () => {
    const component = render(<WriteBlog />);

    //adds text to title input
    const title = component.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    expect(title.value).toBe(exampleBlogPost.title);

    //add text to summary input
    const summary = component.getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });
    expect(summary.value).toBe(exampleBlogPost.summary);

    //add text to blog content
    const content = component.getByTestId('writeContent');
    fireEvent.change(content, { target: { value: exampleBlogPost.content } });
    expect(content.value).toBe(exampleBlogPost.content);
  });

  test('should clear title, summary and content upon submit', () => {
    const component = render(<WriteBlog />);

    //adds text to title, summary and content inputs
    const title = component.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    const summary = component.getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });
    const content = component.getByTestId('writeContent');
    fireEvent.change(content, { target: { value: exampleBlogPost.content } });

    //clicks submit button
    const submit = component.getByTestId('submit');
    fireEvent.click(submit);

    expect(title.value).toBe('');
    expect(summary.value).toBe('');
    expect(content.value).toBe('');
  });

  test('submited blog post should include fields title, summary and content', () => {
    let postedData;

    mockAxios.post.mockImplementationOnce((route, data) => {
      postedData = JSON.parse(data);
    });

    const component = render(<WriteBlog />);

    //adds text to title, summary and content inputs
    const title = component.getByTestId('writeTitle');
    fireEvent.change(title, { target: { value: exampleBlogPost.title } });
    const summary = component.getByTestId('writeSummary');
    fireEvent.change(summary, { target: { value: exampleBlogPost.summary } });
    const content = component.getByTestId('writeContent');
    fireEvent.change(content, { target: { value: exampleBlogPost.content } });

    //clicks submit button
    const submit = component.getByTestId('submit');
    fireEvent.click(submit);

    expect(postedData.title).toEqual(exampleBlogPost.title);
    expect(postedData.summary).toEqual(exampleBlogPost.summary);
    expect(postedData.content).toEqual(exampleBlogPost.content);
  });
});