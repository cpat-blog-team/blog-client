import React from "react";
import { render, wait, getByTestId } from "@testing-library/react";
import CommunityGuidelines from "./CommunityGuidelines";
import "@testing-library/jest-dom";
import axios from 'axios';
import { Router } from 'react-router-dom';
import userContext from '../userContext';
//using example Post as example guidelines because guidelines can use the content from post
import { exampleBlogPost } from './exampleBlogPost';

jest.mock('axios');
jest.mock('quill/dist/quill.snow.css', () => jest.fn());

describe("CommunityGuidelines component", () => {
  let queriedRoute;
  let postedData;
  let component;

  const mockHistory = {
    push: (route) => (pushedRoute = route),
    location: {},
    listen: jest.fn()
  };

  const mockUserCtx = (scopes = {}) => {
    const userCtx = {
      name: exampleBlogPost.name,
      email: exampleBlogPost.email,
      scopes
    };
    return userCtx;
  };

  const renderCommunityGuidelines = async (userCtx) => {
    component = await render(
      <Router history={mockHistory}>
        <userContext.Provider value={userCtx}>
          <CommunityGuidelines />
        </userContext.Provider>
      </Router>
    );
  };

  beforeAll(() => {
    window.document.getSelection = () => ({
      getRangeAt: () => { }
    })

    axios.mockImplementation(() => Promise.resolve({ data: { communityGuidelines: { content: JSON.stringify({ ops: [] }) } } }));

    axios.post.mockImplementation((route, data) => {
      queriedRoute = route;
      postedData = JSON.parse(data);
      return Promise.resolve();
    });
  });

  beforeEach(async (done) => {
    await wait(() => renderCommunityGuidelines(mockUserCtx()));
    done();
  });

  test("canary test", () => {
    expect(true).toEqual(true);
  });

  test("expect CommunityGuidelines to render", () => {
    expect(component.container).toBeInTheDocument();
  });

  test('should  node render update community guidelines switch when user does not have update_guidelines role', () => {
    const { queryByTestId } = component;
    expect(queryByTestId('update-community-guidelines-toggle-toggle')).toEqual(null);
  });

  test('should render update community guidelines switch when user has update_guidelines role', async (done) => {
    const scopes = { update_guidelines: true };
    await wait(() => {
      renderCommunityGuidelines(mockUserCtx(scopes));
    });
    const { getByTestId } = component;
    getByTestId('update-community-guidelines-toggle-toggle')
    done();
  });
});
