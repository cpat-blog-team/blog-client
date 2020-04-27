import React from 'react';
import { render, wait } from '@testing-library/react';
import { exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import NavBar from './NavBar';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('BlogList component', () => {
  let component;
  let pushedRoute;

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

  const renderComponent = async (userCtx) => {
    component = await render(
      <Router history={mockHistory}>
        <userContext.Provider value={userCtx}>
          <NavBar />
        </userContext.Provider>
      </Router>
    );
  };

  beforeEach(async (done) => {
    axios.mockImplementation(() => Promise.resolve());
    await wait(() => renderComponent(mockUserCtx({ manage_appid: true })));
    done();
  });

  test('canary test', () => {
    expect(true).toEqual(true);
  });

  test('expect BlogList to render', () => {
    expect(component.container).toBeInTheDocument();
  });
});
