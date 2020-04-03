import React from 'react';
import { render, wait } from '@testing-library/react';
import { exampleList } from './exampleBlogPost'
import BlogList from './BlogList';
import '@testing-library/jest-dom';
import mockAxios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({}) 
}));

describe('BlogList component', () => {
  let component;
  let queriedRoute;

  beforeAll(() => {
    // this mock api call will store the route its invoke with and store it in the var "queriedRoute" for testing
    mockAxios.mockImplementation((route) => {
      queriedRoute = route;
      return Promise.resolve({ data: { blogs: exampleList(5) } });
    });
  });

  beforeEach(async () => {
    // component must be awaited because useEffect makes an api call up first render
    await wait(() => {
      component = render(<BlogList />);
    });
  });

  test('canary test', () => {
    expect(true).toEqual(true);
  });

  test('expect BlogList to render', () => {
    expect(component.container).toBeInTheDocument();
  });

  test('use effect should call api at endpoint /blogs and render response', () => {
    expect(queriedRoute).toBe('/blogs')
    expect(component.getByTestId('blogPost0')).toBeInTheDocument();
    expect(component.getByTestId('blogPost1')).toBeInTheDocument();
    expect(component.getByTestId('blogPost2')).toBeInTheDocument();
    expect(component.getByTestId('blogPost3')).toBeInTheDocument();
    expect(component.getByTestId('blogPost4')).toBeInTheDocument();
  });

  test('render the update button if the blog post is the post of the user', () => {
    
  });
});