import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { BlogPostInterface, emptyBlogPost } from './exampleBlogPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { OverflowMenu, OverflowMenuItem, Modal, TextArea } from 'carbon-components-react';
import axios from 'axios';

interface Props {}

export default function ViewBlog(props: Props) {
	const { _id } = useParams();
	const [ blog, setBlog ] = useState<BlogPostInterface>(emptyBlogPost());
	const [ html, setHtml ] = useState('');
	const [ reportModalOpen, setReportModalOpen] = useState(false);
	const [ review, setReview ] = useState('');
	const history = useHistory();

	const loadBlog = ({ blog }) => {
		const content = JSON.parse(blog.content);
		const converter = new QuillDeltaToHtmlConverter(content.ops);
		setHtml(converter.convert());
		setBlog(blog);
	};

	const getFieldsToPatch = () =>
		JSON.stringify({
			approved: 'Pending',
			review
		});

	const reportBlog = async () => {
		await axios.patch(`/api/blogs/${_id}`, getFieldsToPatch(), {
			headers: { 'Content-Type': 'application/json' }
		});
		history.push('/');
	}

	const handleChangeReview = ({ value }) => setReview(value);

	useEffect(() => {
		axios(`/api/blogs/${_id}`).then(({ data }) => loadBlog(data)).catch((err) => console.error(err));
	}, []);

	const { title, summary, name, date, filename, approved } = blog;

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
				<div className="blog-more-info">
					<div>
						<strong className="h4" data-testid="blogUsername">
							{name}
						</strong>
						<br />
						<small className="text-muted" data-testid="blogDate">
							{date}
						</small>
					</div>

					{approved !== 'Rejected' &&
					<OverflowMenu data-testid="more-info-wrapper">
						<OverflowMenuItem
							itemText="Report"
							onClick={() => setReportModalOpen(true) }
							primaryFocus
							isDelete
						/>
					</ OverflowMenu>}
					
				</div>
				<img
					style={{ height: '100%', width: '100%', marginTop: '2rem', marginBottom: '2rem' }}
					src={`/api/images/${filename}`}
				/>
				<div
					className="formatted-blog-content"
					data-testid="blogContent"
					dangerouslySetInnerHTML={{ __html: html }}
				/>

			<Modal
				open={reportModalOpen}
				onRequestClose={() => setReportModalOpen(false)}
				modalHeading={"Report Blog"}
				primaryButtonText="Submit"
				secondaryButtonText="Cancel"
				onSecondarySubmit={() => setReportModalOpen(false)}
				onRequestSubmit={() => {
					setReportModalOpen(false);
					reportBlog();
				}}
			>
				<p>Reported posts will be reviewed by admin for rules violations.</p>
				<TextArea
					value={review}
					onChange={({ target }) => handleChangeReview(target)}
					labelText="Please provide use with more information."
				/>
			</Modal>
			</div>

		</div>
	);
}
