import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button, Modal, FileUploaderDropContainer, FileUploaderItem } from 'carbon-components-react';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { useCookies } from 'react-cookie';

const modules = {
	toolbar: {
		container: [
			[ { header: [ 1, 2, false ] } ],
			[ 'bold', 'italic', 'underline', 'strike', 'blockquote' ],
			[ { list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' } ],
			[ 'link', 'image' ],
			[ 'clean' ]
		]
	}
};

const formats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'list',
	'bullet',
	'indent',
	'link',
	'image'
];

const Delta = require('quill-delta');

export default function WriteBlog() {
	const history = useHistory();
	const [ cookie, setCookie ] = useCookies();

	const [ thumbnail, setThumbnail ] = useState({ name: '' });
	const [ thumbnailRequired, setThumbnailRequired ] = useState(false);
	const [ title, setTitle ] = useState('');
	const [ invalidTitle, setInvalidTitle ] = useState(false);
	const [ summary, setSummary ] = useState('');
	const [ filename, setFilename ] = useState('');
	const [ invalidSummary, setInvalidSummary ] = useState(false);
	const [ content, setContent ] = useState('<p><br></p>');
	const [ communityGuidelines, setCommunityGuidelines ] = useState({ content: '<p><br></p>', title: '' });
	const [ invalidContent, setInvalidContent ] = useState(false);

	const [ editorMode, setEditorMode ] = useState('');
	const [ delta, setDelta ] = useState(new Delta());
	const [ errorMessage, setErrorMessage ] = useState('');
	const [ openCommunityGuidelinesModal, setOpenCommunityGuidelinesModal ] = useState(false);
	const [ openThumbnailModal, setOpenThumbnailModal ] = useState(false);

	const { _id } = useParams();

	const loadBlog = ({ blog }) => {
		loadContent(blog);
		setTitle(blog.title);
		setSummary(blog.summary);
		setFilename(blog.filename);
	};

	const loadContent = ({ content }) => {
		let { ops } = JSON.parse(content);
		const converter = new QuillDeltaToHtmlConverter(ops);
		setContent(converter.convert());
	};

	const loadCommunityGuidelines = ({ content, title }) => {
		let { ops } = JSON.parse(content);
		const converter = new QuillDeltaToHtmlConverter(ops);
		setCommunityGuidelines({
			content: converter.convert(),
			title
		});
	};

	useEffect(() => {
		if (_id) {
			setEditorMode('update');
			axios(`/api/blogs/${_id}`)
				.then(({ data }) => {
					loadBlog(data);
				})
				.catch((err) => console.error(err));
		} else {
			setEditorMode('default');
		}

		axios(`/api/communityGuidelines`)
			.then(({ data }) => {
				loadCommunityGuidelines(data.communityGuidelines);
			})
			.catch((err) => console.error(err));
	}, []);

	const b64toBlob = (dataURI) => {
		var byteString = atob(dataURI.split(',')[1]);
		var ab = new ArrayBuffer(byteString.length);
		var ia = new Uint8Array(ab);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ ab ], { type: 'image/jpeg' });
	};

	const isBase64 = (str) => {
		if (str ==='' || str.trim() ===''){ return false; }
		try {
			return btoa(atob(str)) == str;
		} catch (err) {
			return false;
		}
	}

	const formatDelta = async (delta) => {
		const formattedDelta: any = { ...delta };

		// upload images to db and replace base64 with urls to images
		for await (let field of formattedDelta.ops) {
			if (typeof field.insert === 'object') {
				if (isBase64(field.insert.image)) {
					// convert image from base 64 to blob
					const image = b64toBlob(field.insert.image);

					// await upload of image to mongo
					const formData = new FormData();
					formData.append('file', image);
					const { data } = await axios.post('/api/uploads', formData, {
						headers: { 'Content-Type': 'multipart/form-data' }
					});

					// replace value of image to be url to db
					field.insert.image = `/api/${data.url}`;
				}
			}
		}
		console.log(formattedDelta);
		return formattedDelta;
	};

	const formatPost = async () => {
		const blogPost = new FormData();
		const formattedDelta = await formatDelta(delta);
		const { data } = await axios.get('/user');

		blogPost.append('version', '1');
		blogPost.append('name', data.name);
		blogPost.append('email', data.email);
		blogPost.append('title', title);
		blogPost.append('content', JSON.stringify(formattedDelta));
		blogPost.append('summary', summary);
		// @ts-ignore
		blogPost.append('file', thumbnail);
		return blogPost;
	};

	const clearForm = () => {
		setTitle('');
		setSummary('');
		setContent('');
		setDelta(new Delta());
	};

	const validateFormUI = () => {
		validateTitle(title);
		validateSummary(summary);
		validateContent(content);
	};

	const submit = async () => {
		const formData = await formatPost();
		try {
			if(editorMode === 'update') {
				axios.patch(`/api/blogs/${_id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
			} else {
				axios.post('/api/blogs/add', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
			}
			submitSuccess();
		} catch (err) {
			submitFail(err);
		}
	};

	const submitSuccess = () => {
		clearForm();
		setCookie('cpat_blog_posted', true, { path: '/', maxAge: 60 });
		history.push('/');
	};

	const submitFail = (error) => {
		const { response } = error;
		if (response) {
			if (response.status === 413) {
				setErrorMessage('Image too large. Please use different image!');
			} else if (response.statusText) setErrorMessage(response.statusText);
		} else {
			console.error(error);
			setErrorMessage('Error: Submission Failed');
		}
	};

	const removeHTMLTags = (value) => value.replace(/<[^>]*>/g, '');

	const handleSubmit = () => {
		if (!filename) {
			if (title && summary && removeHTMLTags(content)) {
				setOpenThumbnailModal(true);
			} else {
				validateFormUI();
			}
		} else {
			setOpenCommunityGuidelinesModal(true);
		}
	};

	const validateTitle = (value) => (value ? setInvalidTitle(false) : setInvalidTitle(true));
	const validateSummary = (value) => (value ? setInvalidSummary(false) : setInvalidSummary(true));
	const validateContent = (value) => (removeHTMLTags(value) ? setInvalidContent(false) : setInvalidContent(true));
	const validateContentOnBlur = () => (content ? setInvalidContent(false) : setInvalidContent(true));

	const handleChangeTitle = ({ target }) => {
		setTitle(target.value);
		validateTitle(target.value);
	};
	const handleChangeSummary = ({ target }) => {
		setSummary(target.value);
		validateSummary(target.value);
	};
	const handleChangeContent = (content, delta, source, editor) => {
		setContent(content);
		validateContent(content);
		setDelta(editor.getContents());
	};

	return (
		<form
			className="textEditorWrapper"
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit();
			}}
		>
			{editorMode != 'updateGuidelines' && (
				<TextInput
					id="blogTitle"
					data-testid="writeTitle"
					name="title"
					labelText=""
					hideLabel
					onBlur={({ target }) => validateTitle(target.value)}
					value={title}
					placeholder="Blog Post Title"
					invalid={invalidTitle ? true : false}
					invalidText="Title is required"
					onChange={handleChangeTitle}
				/>
			)}

			<br />
			<br />

			{editorMode != 'updateGuidelines' && (
				<TextInput
					id="blogSummary"
					data-testid="writeSummary"
					name="summary"
					labelText=""
					hideLabel
					onBlur={({ target }) => validateSummary(target.value)}
					value={summary}
					placeholder="Summary"
					invalid={invalidSummary ? true : false}
					invalidText="Summary is required"
					onChange={handleChangeSummary}
				/>
			)}

			<div className="textEditorContainer">
				<ReactQuill
					className={invalidContent ? 'bx--text-input--invalid' : ''}
					value={content}
					onBlur={validateContentOnBlur}
					onChange={handleChangeContent}
					modules={modules}
					formats={formats}
				/>
				<div
					style={{ visibility: invalidContent ? 'visible' : 'hidden' }}
					className="bx--form-requirement"
					id="blogSummary-error-msg"
				>
					Body is required
				</div>
			</div>
			<Button id="blogSubmit" data-testid="submit" type="submit" kind="primary">
				Submit
			</Button>

			{/* Error Modal will open automatically when errorMessage state is set */}
			<Modal
				modalLabel="Error"
				open={errorMessage ? true : false}
				onRequestClose={() => setErrorMessage('')}
				passiveModal
				modalHeading="Sorry We Couldn't Submit Your Post!"
			>
				<p>{errorMessage}</p>
			</Modal>

			{/* Thumbnail Modal will when openThumbnailModal state is set to true */}
			<Modal
				data-testid="thumbnail-modal"
				modalLabel="Please Upload A Thumbnail"
				open={openThumbnailModal}
				onRequestClose={() => setOpenThumbnailModal(false)}
				modalHeading="Upload Image"
				primaryButtonText="Next"
				secondaryButtonText="Cancel"
				onSecondarySubmit={() => setOpenThumbnailModal(false)}
				onRequestSubmit={() => {
					if (thumbnail.name !== '') {
						setThumbnailRequired(false);
						setOpenThumbnailModal(false);
						setOpenCommunityGuidelinesModal(true);
					} else {
						setThumbnailRequired(true);
					}
				}}
			>
				<FileUploaderDropContainer
					labelText="Drag and drop files here or click to upload. Only .jpg, .png, .gif files accepted."
					onChange={({ target }: any) => {
						setThumbnail(target.files[0]);
						setThumbnailRequired(false);
					}}
					accept={[ '.jpg', '.png', '.gif', '.jpeg' ]}
				/>
				{thumbnailRequired && <p style={{ color: 'red' }}>Thumbnail is required</p>}
				{thumbnail.name != '' && (
					<FileUploaderItem
						id="thumbnail-upload-item"
						errorBody="500kb max file size. Select a new file and try again."
						errorSubject="File size exceeds limit"
						iconDescription="Clear file"
						name={thumbnail.name}
						onDelete={() => setThumbnail({ name: '' })}
						status="complete"
					/>
				)}
			</Modal>
			{/* Community Guidelines Modal will when openCommunityGuidelinesModal state is set to true */}
			<Modal
				data-testid="community-guidelines-modal"
				modalLabel="Please Accept To Continue"
				open={openCommunityGuidelinesModal}
				onRequestClose={() => setOpenCommunityGuidelinesModal(false)}
				modalHeading={communityGuidelines.title}
				primaryButtonText="Accept"
				secondaryButtonText="Cancel"
				onSecondarySubmit={() => setOpenCommunityGuidelinesModal(false)}
				onRequestSubmit={() => {
					setOpenCommunityGuidelinesModal(false);
					submit();
				}}
			>
				<div
					className="formatted-blog-content"
					data-testid="community-guidelines"
					dangerouslySetInnerHTML={{ __html: communityGuidelines.content }}
				/>
			</Modal>
		</form>
	);
}
