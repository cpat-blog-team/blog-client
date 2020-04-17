import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { exampleBlogPost } from './exampleBlogPost'
import userContext from "../userContext";
import NavBar from './NavBar';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';

describe('BlogList component', () => {
  let component;
  let pushedRoute;

  const mockHistory = {
    push: (route) => pushedRoute = route,
    location: {},
    listen: jest.fn()
  }

  const mockUserCtx = {
    name: exampleBlogPost.name,
    email: exampleBlogPost.email,
    scopes: {}
  }

  beforeEach(() => {
    component = render(
      <Router history={mockHistory}>
        <userContext.Provider value={mockUserCtx} >
          <NavBar />
        </userContext.Provider>
      </Router>
    )
  });

  test('canary test', () => {
    expect(true).toEqual(true);
  });

  test('expect BlogList to render', () => {
    expect(component.container).toBeInTheDocument();
  });

  test('clicking write blog icon in nav bar should push path /writeBlog to history', () => {
    const { getByTestId } = component;
    fireEvent.click(getByTestId('nav-bar-write-blog-button'));
    expect(pushedRoute).toBe('/writeBlog');
  });

  test('clicking "Write A Blog" button in side nav should push path /writeBlog to history', () => {
    const { getByTestId } = component;
    fireEvent.click(getByTestId('side-nav-write-a-blog-button'));
    expect(pushedRoute).toBe('/writeBlog');
  });

  test('clicking "My Blog Posts" button in side nav should push path /writeBlog to history', () => {
    const { getByTestId } = component;
    fireEvent.click(getByTestId('side-nav-my-blog-posts-button'));
    expect(pushedRoute).toBe(`/blogList/username/${mockUserCtx.name}`);
  });

  test('should not render admin actions in side nav when user does not have proper scopes', () => {
    const { queryByTestId } = component;
    expect(queryByTestId('side-nav-community-guidelines-button')).toBe(null);
    expect(queryByTestId('side-nav-user-privileges-button')).toBe(null);
    expect(queryByTestId('side-nav-blog-approval-button')).toBe(null);
  });
});