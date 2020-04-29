import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import { exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import ManageAppID from './ManageAppID';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';
import axios from 'axios';

jest.mock('axios');

describe('ManageAppID component', () => {
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

	const exampleUsers = [ { email: 'bob', id: '123' }, { email: 'john', id: '456' } ];

	beforeAll(() => {
		axios.put.mockImplementation((route) => (queriedRoute = route));
		axios.mockImplementation((route) => {
			queriedRoute = route;
			if (route.includes('users')) return Promise.resolve({ data: exampleUsers });
			else return Promise.resolve({ data: { roles: [ 'moderator' ], activeRole: 'moderator' } });
		});
	});

	beforeEach(async (done) => {
		await wait(() => renderManageAppID(mockUserCtx({ manage_appid: true })));
		done();
	});

	test('canary test', () => {
		expect(true).toEqual(true);
	});

	test('expect ManageAppID to render', () => {
		expect(component.container).toBeInTheDocument();
	});

	test('should make get request to endpoint "/api/appid/users"', async (done) => {
		expect(queriedRoute).toBe('/api/appid/users');
		done();
	});

	test('should make get request to endpoint "/api/appid/roles/:id"', async (done) => {
		const { getByTestId } = component;
		const firstUserEmail = getByTestId(`appid-email-${exampleUsers[0].email}`);
		await wait(() => fireEvent.click(firstUserEmail));

		expect(queriedRoute).toBe(`/api/appid/roles/${exampleUsers[0].id}`);
		done();
	});

	test('should make put request to endpoint "/api/appid/roles/:id"', async (done) => {
		const { getByText, getByTestId } = component;

		const firstUserEmail = getByTestId(`appid-email-${exampleUsers[0].email}`);
		await wait(() => fireEvent.click(firstUserEmail));

		const submit = getByText('Submit');
		await wait(() => fireEvent.click(submit));

		expect(queriedRoute).toBe(`/api/appid/roles/${exampleUsers[0].id}`);
		done();
	});
});
