import React from 'react';
import { render, wait } from '@testing-library/react';
import { exampleList, exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import MyBlogList from './MyBlogList';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
	useHistory: () => ({
		push: jest.fn()
	}),
	useParams: () => ({})
}));

describe('MyBlogList component', () => {
	let component;
	let queriedRoute;

	beforeAll(() => {
		// this mock api call will store the route its invoke with and store it in the var "queriedRoute" for testing
		axios.mockImplementation((route) => {
			queriedRoute = route;
			return Promise.resolve({ data: { blogs: exampleList(5) } });
		});
	});

	beforeEach(async (done) => {
		// component must be awaited because useEffect makes an api call up first render
		await wait(() => {
			component = render(
				<userContext.Provider value={{ name: exampleBlogPost.name }}>
					<MyBlogList />
				</userContext.Provider>
			);
		});
		done();
	});

	test('canary test', () => {
		expect(true).toEqual(true);
	});

	test('BlogList should render', () => {
		expect(component.container).toBeInTheDocument();
	});
});
