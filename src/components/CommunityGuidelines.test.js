import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import CommunityGuidelines from "./CommunityGuidelines";
import "@testing-library/jest-dom";
import mockAxios from 'axios';
//using example Post as example guidelines because guidelines can use the content from post
import { examplePost as exampleGuidelines } from './exampleBlogPost';

jest.mock('axios');
jest.mock('quill/dist/quill.snow.css', () => jest.fn());

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({ _id: null })
}));

describe("CommunityGuidelines component", () => {
  let queriedRoute;
  let postedData;
  let component;

  beforeAll(() => {
    window.document.getSelection = () => ({
      getRangeAt: () => { }
    })

    mockAxios.mockImplementation(() => Promise.resolve({ data: { communityGuidelines: { content: JSON.stringify({ ops: [] }) } } }));

    mockAxios.post.mockImplementation((route, data) => {
      queriedRoute = route;
      postedData = JSON.parse(data);
      return Promise.resolve();
    });
  });

  beforeEach(async (done) => {
    await wait(() => component = render(<CommunityGuidelines />));
    done();
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect CommunityGuidelines to render", () => {
    expect(component.container).toBeInTheDocument();
  });
});
