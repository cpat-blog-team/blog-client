import React from 'react';
import { render, wait } from '@testing-library/react';
import { exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import ManageAppID from './ManageAppID';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('BlogList component', () => {
  let component;
  let pushedHistory;
  let queriedRoute;

  const mockHistory = {
    push: (path) => (pushedHistory = path),
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

  const renderManageAppID = async (userCtx) => {
    component = await render(
      <Router history={mockHistory}>
        <userContext.Provider value={userCtx}>
          <ManageAppID />
        </userContext.Provider>
      </Router>
    );
  };

  beforeAll(() => {
    axios.mockImplementation((route) => {
      queriedRoute = route;
      return Promise.resolve({ data: { users: [] } });
    });
  })

  beforeEach(async (done) => {
    await wait(() => renderManageAppID(mockUserCtx({ manage_appid: true })));
    done();
  });

  test('canary test', () => {
    expect(true).toEqual(true);
  });

  test('expect BlogList to render', () => {
    expect(component.container).toBeInTheDocument();
  });

  test('should make get request to endpoint "/api/appid/users"', async (done) => {
    expect(queriedRoute).toBe('/api/appid/users');
    done();
  });
});
