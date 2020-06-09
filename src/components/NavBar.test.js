import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { exampleBlogPost } from './exampleBlogPost';
import userContext from '../userContext';
import NavBar from './NavBar';
import '@testing-library/jest-dom';
import { Router } from 'react-router-dom';

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
		await wait(() => renderComponent(mockUserCtx()));
		done();
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

	test('clicking "My Blog Posts" button in side nav should push path /myBlogList to history', () => {
		const { getByTestId } = component;
		fireEvent.click(getByTestId('side-nav-my-blog-posts-button'));
		expect(pushedRoute).toBe(`/myBlogList/username/${mockUserCtx().name}`);
	});

	test('clicking "Community Guidelines" button in side nav should push path /communityGuidelines to history', () => {
		const { getByTestId } = component;
		fireEvent.click(getByTestId('side-nav-community-guidelines-button'));
		expect(pushedRoute).toBe(`/communityGuidelines`);
	});

	test('should not render admin actions in nav bar when user does not have proper scopes', () => {
		const { queryByTestId } = component;
		expect(queryByTestId('side-nav-admin-actions')).toBe(null);
		expect(queryByTestId('side-nav-update-guidelines-button')).toBe(null);
		expect(queryByTestId('side-nav-blog-approval-button')).toBe(null);
		expect(queryByTestId('side-nav-user-privileges-button')).toBe(null);
	});

	test('should not render admin actions in side nav when user does not have proper scopes', () => {
		const { queryByTestId } = component;
		expect(queryByTestId('nav-nav-admin-actions')).toBe(null);
		expect(queryByTestId('Nav Bar Update Guidelines Button')).toBe(null);
		expect(queryByTestId('Nav Bar Blog Approval Button')).toBe(null);
		expect(queryByTestId('Nav Bar User Privileges Button')).toBe(null);
	});

	test('should render "update guidelines" button in nav bar and side nav when user has scope "update_guidelines"', async (
		done
	) => {
		const scopes = {
			update_guidelines: true
		};
		await wait(() => {
			renderComponent(mockUserCtx(scopes));
		});
		const { getByTestId } = component;
		getByTestId('nav-bar-admin-actions');
		getByTestId('side-nav-admin-actions');
		getByTestId('Nav Bar Update Guidelines Button');
		getByTestId('side-nav-update-guidelines-button');
		done();
	});

	test('should render "blog approval" button in nav bar and side nav when user has scope "update_guidelines"', async (
		done
	) => {
		const scopes = {
			manage_blogs: true
		};
		await wait(() => {
			renderComponent(mockUserCtx(scopes));
		});
		const { getByTestId } = component;
		getByTestId('nav-bar-admin-actions');
		getByTestId('side-nav-admin-actions');
		getByTestId('Nav Bar Blog Approval Button');
		getByTestId('side-nav-blog-approval-button');
		done();
	});

	test('should render "user privileges" button in nav bar and side nav when user has scope "update_guidelines"', async (
		done
	) => {
		const scopes = {
			manage_appid: true
		};
		await wait(() => {
			renderComponent(mockUserCtx(scopes));
		});
		const { getByTestId } = component;
		getByTestId('nav-bar-admin-actions');
		getByTestId('side-nav-admin-actions');
		getByTestId('Nav Bar User Privileges Button');
		getByTestId('side-nav-user-privileges-button');
		done();
	});
});
