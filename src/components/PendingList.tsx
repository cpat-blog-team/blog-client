import * as React from 'react';
import userContext from '../userContext';
import { useState, useEffect, useContext } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal } from 'carbon-components-react';
import Thumbnail from './Thumbnail';
import { ClickableTile } from 'carbon-components-react';

interface Props {}

export default function PendingList(props: Props) {
	const history = useHistory();
	const { searchType, searchValue } = useParams();

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

	const formatBlogs = (list) => {
		let size = 'thumbnail-container';
		let direction = 'content-row';

		return list.map(({ title, summary, date, name, _id, filename, review }, i) => (
			<div key={i} data-testid="blogPost" className="blog-row-wrapper">
				<ClickableTile
					className="blog-list-row my-blog-row"
					// @ts-ignore
					handleClick={() => history.push(`/approveBlog/id=${_id}`)}
				>
					<div className="blog-list-row">
						<div className={direction}>
							<div onClick={() => history.push(`/approveBlog/id=${_id}`)}>
								<Thumbnail size={size} filename={filename} />
							</div>

							<div className="content-item">
								<div className="title-summary" onClick={() => history.push(`/approveBlog/id=${_id}`)}>
									<h4 className="blog-title">{title}</h4>
									<p className="blog-summary">{summary}</p>
								</div>

								<div className="content-bottom">
									<div
										className="blog-author-date"
										onClick={() => history.push(`/approveBlog/id=${_id}`)}
									>
										<div className="blog-author">{name}</div>
										<div className="blog-date">{date}</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{review && (
						<div className="report-info-wrapper">
							<h4>Report details</h4>
							<p>{review}</p>
						</div>
					)}
				</ClickableTile>
			</div>
		));
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
				<div className="header-wrapper">
					<h1 className="header-text">Pending blogs</h1>
				</div>
				{formatBlogs(list)}

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
