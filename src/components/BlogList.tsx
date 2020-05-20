import * as React from 'react';
import userContext from '../userContext';
import { useState, useEffect, useContext } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link, Modal, ToastNotification } from 'carbon-components-react';
import Thumbnail from './Thumbnail';
import { useCookies } from 'react-cookie';

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
	const [ notificationClassName, setNotificationClassName ] = useState('slide-in');

	return (
		<div>
			<div className="banner">
				<div className="banner-title">cpat blog</div>
				<h3>Bringing fellow cpat'ers together</h3>
			</div>

			{/* Render Notification if user has cookie indicating they have posted a blog within the last 60 seconds */}
			{cookies.cpat_blog_posted && (
				<ToastNotification
					kind="success"
					caption={
						<a
							href="#"
							onClick={() => {
								setNotificationClassName('slide-out');
								removeCookie('cpat_blog_posted');
							}}
						>
							Dismiss
						</a>
					}
					iconDescription="describes the close button"
					subtitle={
						<span>
							Your post has been submitted for review.
							<br />
							<a href="#">Click here</a> to learn more about the approval process.
						</span>
					}
					timeout={10000}
					title="Post Success"
					style={{
						position: 'fixed',
						top: '6rem',
						left: '3rem',
						zIndex: 2
					}}
					className={notificationClassName}
					hideCloseButton={true}
				/>
			)}

			<div className="container-wide">
				<hr className="my-4" />
				<div />
				{list.map(({ title, summary, date, name, _id, filename }, i) => (
					<div key={i} data-testid={`blogPost${i}`}>
						<div className="blog-list-row">
							<div className="blog-list-row-left">
								<div onClick={() => history.push(`/viewBlog/id=${_id}`)} className="content-row">
									<Thumbnail filename={filename} />

									<div className="content-item">
										<h5>{title}</h5>
										<p>{summary}</p>
										<div>{name}</div>
										<div>{date}</div>
									</div>
								</div>
							</div>

							<div className="blog-list-row-right">
								<div className="blog-list-component">
									{currentUsername === name && (
										<Link href={`/writeBlog/id=${_id}`} data-testid={`updateLink${i}`}>
											Update
										</Link>
									)}
									{currentUsername === name && (
										<Link href="#" data-testid={`deleteLink${i}`} onClick={() => setDeleteId(_id)}>
											Delete
										</Link>
									)}
									{searchType === 'approved' && (
										<Link href={`/approveBlog/id=${_id}`} data-testid={`reviewLink${i}`}>
											Review
										</Link>
									)}
								</div>
							</div>
						</div>
					</div>
				))}

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
