import React from 'react';
import { render, wait } from '@testing-library/react';
import { exampleList, exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import PendingList from './PendingList';
import '@testing-library/jest-dom';
import axios from 'axios';

jest.mock('axios');

jest.mock('react-router-dom', () => ({
	useHistory: () => ({
		push: jest.fn()
	}),
	useParams: () => ({})
}));

describe('PendingList component', () => {
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
					<PendingList />
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

	test('use effect should call api at endpoint /api/blogs and render response', () => {
		const { getAllByTestId } = component;
		expect(queriedRoute).toBe('/api/blogs');
		getAllByTestId('blogPost');
	});

	test('render the update and delete more info wrapper if the blog post is the post of the user', () => {
		const { getAllByTestId } = component;
		getAllByTestId('more-info-wrapper')
	});
});
