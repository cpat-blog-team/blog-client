import React from "react";
import { render, wait } from "@testing-library/react";
import App from "./app";
import "@testing-library/jest-dom";
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import userContext from "./userContext";

jest.mock('axios');
jest.mock('quill/dist/quill.snow.css', () => jest.fn());

const mockUserCtx = {
  name: '',
  email: '',
  scopes: {
    community_guidelines: false
  }
}

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
    await wait(() => component = render(
      <BrowserRouter>
        <userContext.Provider value={mockUserCtx} >
          <App />
        </userContext.Provider>
      </BrowserRouter>));
    expect(component.container).toBeInTheDocument();
    done();
  });
});
