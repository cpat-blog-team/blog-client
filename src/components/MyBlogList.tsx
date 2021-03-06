import * as React from 'react';
import userContext from '../userContext';
import { useState, useEffect, useContext } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Thumbnail from './Thumbnail';
import { Modal, OverflowMenu, OverflowMenuItem, Tabs, Tab, Tile } from 'carbon-components-react';

interface Props {}

export default function MyBlogList(props: Props) {
	const history = useHistory();
	const { searchType, searchValue } = useParams();
	const { name: currentUsername } = useContext(userContext);

	const [ list, setList ] = useState<BlogPostInterface[]>([]);
	const [ deleteId, setDeleteId ] = useState('');

	const getQuery = () => {
		if (searchType) return `/api/blogs/search?${searchType}=${searchValue}`;
		return '/api/blogs';
	};

	const getBlogs = async () => {
		try {
			const query = getQuery();
			const { data } = await axios(query);
			setList(data.blogs);
		} catch (err) {
			console.error(err);
		}
	};

	const formatBlogs = (list, status: any = null) => {
		let size = 'thumbnail-container';
		let direction = 'content-row';

		const new_list = status ? list.filter((post) => post.approved === status) : list;

		if (new_list.length === 0) {
			return (
				<div className="tabs-placeholder">
					<h3 className="tabs-placeholder-text">No blogs available.</h3>
				</div>
			);
		} else {
			return new_list.map(({ title, summary, date, name, _id, filename, approved }, i) => (
				//@ts-ignore
				<div key={i} data-testid="blogPost" className="blog-row-wrapper">
					<Tile className="blog-list-row my-blog-row">
						<div className={direction}>
							<div onClick={() => history.push(`/viewBlog/id=${_id}`)}>
								<Thumbnail size={size} filename={filename} />
							</div>

							<div className="content-item">
								<div className="title-summary" onClick={() => history.push(`/viewBlog/id=${_id}`)}>
									<h4 className="blog-title">{title}</h4>
									<p className="blog-summary">{summary}</p>
								</div>

								<div className="content-bottom">
									<div
										className="blog-author-date"
										onClick={() => history.push(`/viewBlog/id=${_id}`)}
									>
										<div className="blog-author">{name}</div>
										<div className="blog-date">{date}</div>
									</div>
									<div className="blog-list-component" data-testid="more-info-wrapper">
										{currentUsername === name &&
										status != 'Rejected' && (
											<OverflowMenu>
												{currentUsername === name && (
													<OverflowMenuItem
														data-testid={`updateLink${i}`}
														itemText="Update"
														onClick={() => history.push(`/writeBlog/id=${_id}`)}
														primaryFocus
													/>
												)}

												{searchType === 'approved' && (
													<OverflowMenuItem
														data-testid={`reviewLink${i}`}
														itemText="Review"
														onClick={() => history.push(`/approveBlog/id=${_id}`)}
													/>
												)}

												{currentUsername === name && (
													<OverflowMenuItem
														data-testid={`deleteLink${i}`}
														itemText="Delete"
														onClick={() => setDeleteId(_id)}
														isDelete
														hasDivider
													/>
												)}
											</OverflowMenu>
										)}
									</div>
								</div>
							</div>
						</div>
					</Tile>
				</div>
			));
		}
	};

	const deleteBlog = async () => {
		await axios.delete(`/api/blogs/${deleteId}`);
		setDeleteId('');
		getBlogs();
	};

	useEffect(
		() => {
			getBlogs();
		},
		[ searchValue ]
	);

	return (
		<div>
			<div className="container-wide">
				<div className="user-blog-header-container">
					<h1 className="header-text">Your blogs</h1>
				</div>
				<Tabs
					ariaLabel="listbox"
					className="some-class"
					iconDescription="show menu options"
					onKeyDown={function noRefCheck() {}}
					onSelectionChange={function noRefCheck() {}}
					role="navigation"
					selected={0}
					tabContentClassName="user-blog-tabs"
					triggerHref="#"
					//@ts-ignore
					type="container"
				>
					<Tab
						href="#"
						id="tab-3"
						label="Published"
						handleTabAnchorFocus={() => {}}
						handleTabClick={() => {}}
						handleTabKeyDown={() => {}}
						tabIndex={0}
					>
						<div className="approved-content">{formatBlogs(list, 'Approved')}</div>
					</Tab>
					<Tab
						href="#"
						id="tab-1"
						label="Pending"
						handleTabAnchorFocus={() => {}}
						handleTabClick={() => {}}
						handleTabKeyDown={() => {}}
						tabIndex={1}
					>
						<div className="pending-content">{formatBlogs(list, 'Pending')}</div>
					</Tab>
					<Tab
						href="#"
						id="tab-2"
						label="Rejected"
						handleTabAnchorFocus={() => {}}
						handleTabClick={() => {}}
						handleTabKeyDown={() => {}}
						tabIndex={2}
					>
						<div className="rejected-content">{formatBlogs(list, 'Rejected')}</div>
					</Tab>
				</Tabs>
			</div>

			{/* Error Modal will open automatically when errorMessage state is set */}
			<Modal
				open={deleteId ? true : false}
				onRequestClose={() => setDeleteId('')}
				modalHeading="Are you sure you want to delete this blog?"
				primaryButtonText="Yes"
				secondaryButtonText="Cancel"
				onSecondarySubmit={() => setDeleteId('')}
				onRequestSubmit={() => deleteBlog()}
			/>
		</div>
	);
}
