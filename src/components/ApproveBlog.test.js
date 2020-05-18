import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import ApproveBlog from './ApproveBlog';
import '@testing-library/jest-dom';
import { exampleBlogPost } from './exampleBlogPost';
import axios from 'axios';

jest.mock('axios');

let pushedHistory;

jest.mock('react-router-dom', () => ({
	useHistory: () => ({
		push: (route) => (pushedHistory = route)
	}),
	useParams: () => ({
		_id: 'G3J4K56M7J'
	})
}));

describe('ApproveBlog component', () => {
	let component;
	let queriedRoute;

	beforeAll(() => {
		// mockAPI returns a mock blog and stores the queried route in the variable "queriedRoute" for testing
		const mockApi = (route) => {
			queriedRoute = route;
			return Promise.resolve({ data: { blog: exampleBlogPost } });
		};
		axios.mockImplementation(mockApi);
		axios.patch.mockImplementation(mockApi);
	});

	beforeEach(async () => {
		// component must be awaited because useEffect makes an api call upon first render
		await wait(() => {
			component = render(<ApproveBlog />);
		});
	});

	test('canary test', () => {
		expect(true).toEqual(true);
	});

	test('expect ApproveBlog to render', () => {
		expect(component.container).toBeInTheDocument();
	});

	test('should call api for blog post with passed down id from props', () => {
		expect(queriedRoute).toBe(`/api/blogs/${exampleBlogPost._id}`);
	});

	test('should render blog post', () => {
		expect(component.getByText(exampleBlogPost.title)).toBeInTheDocument();
	});

	test('should render review button and modal', () => {
		const { getByTestId } = component;
		getByTestId('review-button');
		getByTestId('review-modal');
	});

	test('should make patch request to endpoint "/blogs/:id" and pass the id in the body and push history to path "/blogList/approved/Pending"', async (
		done
	) => {
		const { getByTestId, getByText } = component;

		// select approve review status
		const reviewStatusSelect = getByTestId('review-status');
		fireEvent.change(reviewStatusSelect, { target: { value: 'Approved' } });
		// reset queried route to test
		queriedRoute = '';
		// clicks submit review button
		const submit = getByText('Submit');
		await wait(() => fireEvent.click(submit));

		expect(queriedRoute).toBe('/api/blogs/G3J4K56M7J');
		expect(pushedHistory).toBe('/blogList/approved/Pending');
		done();
	});
});
