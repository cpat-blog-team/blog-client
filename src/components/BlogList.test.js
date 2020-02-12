import React from "react";
import { render } from "@testing-library/react";
import { exampleList } from './exampleBlogPost'
import BlogList from "./BlogList";
import "@testing-library/jest-dom";
import axiosMock from 'axios';
import { act } from "react-dom/test-utils";

jest.mock('axios');

describe("BlogList component", () => {

  beforeAll(async () => {
    axiosMock.mockImplementation(() => Promise.resolve({ data: { blogs: exampleList(5) } }));
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect BlogList to render", async () => {
    let component;
    await act(async () => {
      component = await render(<BlogList />);
    });

    expect(component.container).toBeInTheDocument();
  });

  test('use effect should call api and set state with response', async () => {
    let component;
    await act(async () => {
      component = await render(<BlogList />);
    });

    expect(component.getByTestId('blogPost0')).toBeInTheDocument();
    expect(component.getByTestId('blogPost1')).toBeInTheDocument();
    expect(component.getByTestId('blogPost2')).toBeInTheDocument();
    expect(component.getByTestId('blogPost3')).toBeInTheDocument();
    expect(component.getByTestId('blogPost4')).toBeInTheDocument();
  });
});