import React from 'react';
import { render, wait } from '@testing-library/react';
import { exampleList, exampleBlogPost } from './exampleBlogPost'
import userContext from "../userContext";
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

  beforeEach(async (done) => {
    // component must be awaited because useEffect makes an api call up first render
    await wait(() => {
      component = render(
        <userContext.Provider value={{ name: exampleBlogPost.name }} >
          <BlogList />
        </userContext.Provider>
      )
    });
    done();
  });

  test('canary test', () => {
    expect(true).toEqual(true);
  });

  test('expect BlogList to render', () => {
    expect(component.container).toBeInTheDocument();
  });

  test('use effect should call api at endpoint /api/blogs and render response', () => {
    const { getByTestId } = component;
    expect(queriedRoute).toBe('/api/blogs')
    getByTestId('blogPost0');
    getByTestId('blogPost1');
    getByTestId('blogPost2');
    getByTestId('blogPost3');
    getByTestId('blogPost4');
  });

  test('render the update and delete buttons if the blog post is the post of the user', () => {
    const { getByTestId } = component;
    getByTestId('updateLink0');
    getByTestId('deleteLink0');
  });
});