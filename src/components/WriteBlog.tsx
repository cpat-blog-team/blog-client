import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import userContext from '../userContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button, Modal } from "carbon-components-react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

const Delta = require('quill-delta');

interface Props { }

export default function WriteBlog(props: Props) {
  const history = useHistory();

  const [title, setTitle] = useState('');
  const [invalidTitle, setInvalidTitle] = useState(false);

  const [summary, setSummary] = useState('');
  const [invalidSummary, setInvalidSummary] = useState(false);

  const [content, setContent] = useState('<p><br></p>');
  const [invalidContent, setInvalidContent] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const [editorMode, setEditorMode] = useState('default');

  const [delta, setDelta] = useState(new Delta());

  const { name, email } = useContext(userContext);


  const { _id } = useParams();

  const loadBlog = ({ blog }) => {
    let content = JSON.parse(blog.content);
    const converter = new QuillDeltaToHtmlConverter(content.ops);
    setContent(converter.convert());
    setTitle(blog.title);
    setSummary(blog.summary);
  }

  useEffect(() => {
    if(_id) {
      setEditorMode('update');
      axios(`/blogs/${_id}`)
      .then(({ data }) => loadBlog(data))
      .catch(err => console.error(err));
    }
  }, []);

  const formatPost = () => ({
    email,
    name,
    title,
    summary,
    content: JSON.stringify(delta),
    version: 1
  });

  const clearForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setDelta(new Delta());
  }

  const validateForm = () => {
    validateTitle(title);
    validateSummary(summary);
    validateContent(content);
  }

  const submit = () => {
    const blogPost = formatPost();

    if(editorMode === 'update') {
      const updateBlogPostBody = {
        ...blogPost,
        _id
      };
    axios.post('/blogs/update', JSON.stringify(updateBlogPostBody), { headers: { 'Content-Type': 'application/json' } })
    .then(() => submitSuccess())
    .catch(({ response }) => submitFail(response))

    } else {
      axios.post('/blogs/add', JSON.stringify(blogPost), { headers: { 'Content-Type': 'application/json' } })
      .then(() => submitSuccess())
      .catch(({ response }) => submitFail(response))
    }
  }

  const submitSuccess = () => {
    clearForm();
    history.push('/');
  }

  const submitFail = ({ status, statusText }) => {
    if (status === 413) {
      setErrorMessage("Image too large. Please use different image!");
    }
    else setErrorMessage(statusText);
  }

  const handleSubmit = () => {
    if (title && summary && content) {
      submit();
    }
    else validateForm();
  }

  const validateTitle = (value) => value ? setInvalidTitle(false) : setInvalidTitle(true);
  const validateSummary = (value) => value ? setInvalidSummary(false) : setInvalidSummary(true);
  const validateContent = (value) => value !== '<p><br></p>' ? setInvalidContent(false) : setInvalidContent(true);
  const validateContentOnBlur = () => content ? setInvalidContent(false) : setInvalidContent(true);

  const handleChangeTitle = ({ target }) => {
    setTitle(target.value);
    validateTitle(target.value);
  }
  const handleChangeSummary = ({ target }) => {
    setSummary(target.value);
    validateSummary(target.value);
  }
  const handleChangeContent = (content, delta, source, editor) => {
    setContent(content);
    validateContent(content);
    setDelta(editor.getContents());
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  return (
    <form
      className="writeBlogContainer"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit();
      }}
    >
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
      <br />
      <br />
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
      <div className="textEditorContainer" >
        <ReactQuill
          className={invalidContent ? "bx--text-input--invalid" : ""}
          value={content}
          onBlur={validateContentOnBlur}
          onChange={handleChangeContent}
          modules={modules}
          formats={formats}
        />
        <div style={{ visibility: invalidContent ? 'visible' : 'hidden' }} className="bx--form-requirement" id="blogSummary-error-msg">Body is required</div>
      </div>
      <Button
        id="blogSubmit"
        data-testid="submit"
        type="submit"
        kind="primary"
      >Submit</Button>

      {/* Error Modal will open automatically when errorMessage state is set */}
      <Modal
        open={errorMessage ? true : false}
        onRequestClose={() => setErrorMessage('')}
        passiveModal
        modalHeading="Sorry We Couldn't Submit Your Post!"
      >
        <p>{errorMessage}</p>
      </Modal>
    </form >
  );
}
