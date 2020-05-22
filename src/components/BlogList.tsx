import * as React from 'react';
import userContext from '../userContext';
import { useState, useEffect, useContext } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'carbon-components-react';
import Thumbnail from './Thumbnail';
import { useCookies } from 'react-cookie';
import Notification from './Notification';
import { OverflowMenu, OverflowMenuItem } from 'carbon-components-react';


interface Props {}

export default function BlogList(props: Props) {
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

	const formatBlogs = (list, bannerBlog=false) => {
		let size = "thumbnail-container";
		let direction = "content-row";

		if (bannerBlog) {
			size = "thumbnail-container-large";
			direction = "content-col";
		}

		return(list.map(({ title, summary, date, name, _id, filename }, i) => (
			<div key={i} data-testid="blogPost">
				<div className="blog-list-row">
					<div className="blog-list-row-left">
						<div className={direction}>
							<div onClick={() => history.push(`/viewBlog/id=${_id}`)}><Thumbnail size={size} filename={filename} /></div>

							<div className="content-item">
								<div className="title-summary" onClick={() => history.push(`/viewBlog/id=${_id}`)}>
									<h4 className="blog-title">{title}</h4>
									<p className="blog-summary">{summary}</p>
								</div>
								
								<div className="content-bottom">
									<div className="blog-author-date" onClick={() => history.push(`/viewBlog/id=${_id}`)}>
										<div className="blog-author">{name}</div>
										<div className="blog-date">{date}</div>
									</div>
									<div className="blog-list-component">
										{ (currentUsername === name || searchType === 'approved') && (
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
				</div>
			</div>
		)));
	}

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

	const [ cookies, setCookie, removeCookie ] = useCookies();

	return (
		<div>
			<div className="banner">
				<div className="left-banner">
					{formatBlogs(list.slice(2,4))}
				</div>

				<div className="right-banner">
					{formatBlogs(list.slice(0,2), true)}
				</div>
			</div>
			{cookies.cpat_blog_posted && (
				<Notification
					kind="success"
					handleClose={() => removeCookie('cpat_blog_posted')}
					title="Post Success"
					subtitle={
						<span>
							Your post has been submitted for review.
							<br />
							<a href="#">Click here</a> to learn more about the approval process.
						</span>
					}
				/>
			)}
			<div className="container-wide">
				<hr className="my-4" />
			<div/>
				{formatBlogs(list.slice(4))}

				{list.length === 0 && (
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
