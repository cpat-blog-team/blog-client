import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BlogPostInterface, emptyBlogPost } from './exampleBlogPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import axios from 'axios';
import { Modal, Select, SelectItem, TextArea, Button } from 'carbon-components-react';

interface Props {}

export default function ApproveBlog(props: Props) {
	const { _id } = useParams();
	const history = useHistory();

	const [ blog, setBlog ] = useState<BlogPostInterface>(emptyBlogPost());
	const [ html, setHtml ] = useState('');
	const [ openModal, setOpenModal ] = useState(false);
	const [ review, setReview ] = useState('');
	const [ approvalStatus, setApprovalStatus ] = useState('');
	const [ selectInvalid, setSelectInvalid ] = useState(false);

	const loadBlog = ({ blog }) => {
		const content = JSON.parse(blog.content);
		const converter = new QuillDeltaToHtmlConverter(content.ops);
		setHtml(converter.convert());
		setBlog(blog);
	};

	useEffect(() => {
		axios(`/api/blogs/${_id}`).then(({ data }) => loadBlog(data)).catch((err) => console.error(err));
	}, []);

	const getFieldsToPatch = () =>
		JSON.stringify({
			approved: approvalStatus,
			review
		});

	const submitReview = async () => {
		if (!approvalStatus) setSelectInvalid(true);
		else {
			await axios.patch(`/api/blogs/${_id}`, getFieldsToPatch(), {
				headers: { 'Content-Type': 'application/json' }
			});
			history.push('/blogStatus/approved/Pending');
		}
	};

	const handleChangeStatus = ({ value }) => {
		setSelectInvalid(false);
		setApprovalStatus(value);
	};

	const handleChangeReview = ({ value }) => setReview(value);

	const { title, summary, name, date } = blog;

	return (
		<div className="jumbotron jumbotron-fluid background-white">
			<div className="container">
				<h1 className="display-4" data-testid="blogTitle">
					{title}
				</h1>
				<p className="lead" data-testid="blogSummary">
					{summary}
				</p>
				<hr className="my-4" />
				<div className="callout callout-info">
					<strong className="h4" data-testid="blogUsername">
						{name}
					</strong>
					<br />
					<small className="text-muted" data-testid="blogDate">
						{date}
					</small>
				</div>
				<div
					className="formatted-blog-content"
					data-testid="blogContent"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
				<div className="row-content-to-right">
					<Button data-testid="review-button" onClick={() => setOpenModal(true)}>
						Review
					</Button>
				</div>
			</div>
			{/* Approve Modal will open automatically when openModal state is set to true*/}
			<Modal
				data-testid="review-modal"
				open={openModal}
				onRequestClose={() => setOpenModal(false)}
				modalHeading="Blog Approval"
				primaryButtonText="Submit"
				secondaryButtonText="Cancel"
				onSecondarySubmit={() => setOpenModal(false)}
				onRequestSubmit={() => submitReview()}
			>
				<Select
					data-testid="review-status"
					id="select-1"
					value={approvalStatus}
					labelText="Status"
					invalid={selectInvalid}
					invalidText="Review status is required"
					onChange={({ target }) => handleChangeStatus(target)}
				>
					<SelectItem hidden value="placeholder-item" text="Set approval status" />
					<SelectItem value="Approved" text="Approve" />
					<SelectItem value="Rejected" text="Reject" />
				</Select>
				<br />
				<TextArea
					data-testid="review-comments"
					value={review}
					onChange={({ target }) => handleChangeReview(target)}
					labelText="Comments"
				/>
			</Modal>
		</div>
	);
}
