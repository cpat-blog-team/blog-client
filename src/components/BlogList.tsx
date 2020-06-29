import * as React from 'react';
import userContext from '../userContext';
import { useState, useEffect, useContext } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import Thumbnail from './Thumbnail';
import { useCookies } from 'react-cookie';
import Notification from './Notification';
import { OverflowMenu, OverflowMenuItem, Tile, Modal } from 'carbon-components-react';

interface Props {}

export default function BlogList(props: Props) {
	const history = useHistory();
	const { searchType, searchValue } = useParams();
	const { name: currentUsername } = useContext(userContext);
	const [ cookies, setCookie, removeCookie ] = useCookies();

	const [ banner, setBanner ] = useState<BlogPostInterface[]>([]);
	const [ list, setList ] = useState<BlogPostInterface[]>([]);
	const [ deleteId, setDeleteId ] = useState('');
	const [ blogRecentlySubmitted, setBlogRecentlySubmitted ] = useState(false);
	
	useEffect(() => {
		getBlogs().then(() => {
			if (cookies.cpat_blog_posted) {
				setBlogRecentlySubmitted(true);
				removeCookie('cpat_blog_posted');
			}
		})
	},
	[ searchValue ]
	);

	const getQuery = () => {
		if (searchType) return `/api/blogs/search?${searchType}=${searchValue}`;
		return '/api/blogs';
	};

	const clearState = () => {
		setBanner([]);
		setList([]);
	};

	const getBlogs = async () => {
		clearState();

		try {
			const query = getQuery();
			const { data } = await axios(query);
			const { blogs } = data;
			if (blogs.length >= 4) {
				setBanner(blogs.slice(0, 4));
				setList(blogs.slice(4));
			} else {
				setList(blogs);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const formatBlogs = (list, bannerBlog = false) => {
		let size = 'thumbnail-container';
		let direction = 'content-row';

		if (bannerBlog) {
			size = 'thumbnail-container-large';
			direction = 'content-col';
		}

		return list.map(({ title, summary, date, name, _id, filename }, i) => (
			<div key={i} data-testid="blogPost" className="blog-row-wrapper blog-list-wrapper">
				<Tile className="blog-list-row">
					<div className="blog-list-row-left">
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
									<div className="blog-list-component">
										{(currentUsername === name || searchType === 'approved') && (
											<OverflowMenu data-testid="more-info-wrapper">
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
					</div>
				</Tile>
			</div>
		));
	};

	const deleteBlog = async () => {
		await axios.delete(`/api/blogs/${deleteId}`);
		setDeleteId('');
		getBlogs();
	};

	return (
		<div>
			{banner && (
				<div className="banner">
					<div className="left-banner">{formatBlogs(banner.slice(2, 4))}</div>
					<div className="right-banner">
						{formatBlogs(banner.slice(0, 1), true)}
						{formatBlogs(banner.slice(1, 2), true)}
					</div>
				</div>
			)}

			{blogRecentlySubmitted && (
				<Notification
					kind="success"
					handleClose={() => removeCookie('cpat_blog_posted')}
					title="Post Success"
					subtitle={
						<span>
							Your post has been successfully submitted. This may take some time before it is uploaded
							onto the feed.
							<br />
						</span>
					}
				/>
			)}

			<div className="container-wide">
				<hr className="my-4" />
				<div />
				<div className="bottom-blog-feed">
					{formatBlogs(list)}
				</div>
				

				{!list &&
				!banner && (
					<div className="banner">
						<h4>...No Blogs Available</h4>
					</div>
				)}
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
