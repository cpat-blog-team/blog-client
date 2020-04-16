import React from "react";
import { render, wait } from "@testing-library/react";
import App from "./app";
import "@testing-library/jest-dom";
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');
jest.mock('quill/dist/quill.snow.css', () => jest.fn())

describe("App component", () => {
  beforeAll(async (done) => {
    await axios.mockImplementation(() => {
      return Promise.resolve({ data: { blogs: [] } });
    });
    done();
  });
  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect app to render", async (done) => {
    let component;
    await wait(() => component = render(<BrowserRouter><App /></BrowserRouter>));
    expect(component.container).toBeInTheDocument();
    done();
  });
});
