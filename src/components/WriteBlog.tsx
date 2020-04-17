import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import userContext from '../userContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button, Modal, ToggleSmall } from "carbon-components-react";
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
  const [oldContent, setOldContent] = useState('<p><br></p>');
  const [communityGuidelines, setCommunityGuidelines] = useState('<p><br></p>');
  const [invalidContent, setInvalidContent] = useState(false);

  const [oldEditorMode, setOldEditorMode] = useState('');
  const [editorMode, setEditorMode] = useState('');
  const [delta, setDelta] = useState(new Delta());
  const [errorMessage, setErrorMessage] = useState('');
  const [openCommunityGuidelinesModal, setOpenCommunityGuidelinesModal] = useState(false);
  const [editCommunityGuidelines, setEditCommunityGuidelines] = useState(false);

  const { _id } = useParams();
  const { scopes } = useContext(userContext);

  const loadBlog = ({ blog }) => {
    loadContent(blog)
    setTitle(blog.title);
    setSummary(blog.summary);
  }

  const loadContent = ({ content }) => {
    let { ops } = JSON.parse(content);
    const converter = new QuillDeltaToHtmlConverter(ops);
    setContent(converter.convert());
  };

  const loadCommunityGuidelines = ({ content }) => {
    let { ops } = JSON.parse(content);
    const converter = new QuillDeltaToHtmlConverter(ops);
    setCommunityGuidelines(converter.convert());
  }


  // This function takes an array of tuples where the first element of each tuple is the state 
  // and the second is a callback function to set the given state
  const setMultiState = (arr) => arr.forEach(([state, setStateCallback]) => setStateCallback(state));

  useEffect(() => {
    if (_id) {
      setEditorMode('update');
      axios(`/api/blogs/${_id}`)
        .then(({ data }) => {
          loadBlog(data)
        })
        .catch(err => console.error(err));
    } else {
      setEditorMode('default');
    }

    axios(`/api/communityGuidelines`)
      .then(({ data }) => {
        loadCommunityGuidelines(data.communityGuidelines)
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (editorMode) {
      if (editCommunityGuidelines && oldContent == '<p><br></p>') {
        setMultiState([[communityGuidelines, setContent], [editorMode, setOldEditorMode], ["updateGuidelines", setEditorMode]]);
      }
      else {
        setMultiState([[content, setOldContent], [oldContent, setContent], [editorMode, setOldEditorMode], [oldEditorMode, setEditorMode]]);
      }

      setOldContent(content);
    }
  }, [editCommunityGuidelines]);

  const formatPost = () => ({
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

    if (editorMode === 'update') {
      const updateBlogPostBody = {
        ...blogPost,
        _id
      };
      axios.post('/api/blogs/update', JSON.stringify(updateBlogPostBody), { headers: { 'Content-Type': 'application/json' } })
        .then(() => submitSuccess())
        .catch(({ response }) => submitFail(response))

    } else if (editorMode === 'updateGuidelines') {
      axios.post('/api/communityGuidelines', JSON.stringify({ content: blogPost.content }), { headers: { 'Content-Type': 'application/json' } })
        .then(() => submitSuccess())
        .catch(({ response }) => submitFail(response))
    } else {
      axios.post('/api/blogs/add', JSON.stringify(blogPost), { headers: { 'Content-Type': 'application/json' } })
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
      setOpenCommunityGuidelinesModal(true);
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
      {editorMode != "updateGuidelines" &&
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
        />}

      <br />
      <br />

      {editorMode != "updateGuidelines" &&
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
        />}

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
        modalLabel='Error'
        open={errorMessage ? true : false}
        onRequestClose={() => setErrorMessage('')}
        passiveModal
        modalHeading="Sorry We Couldn't Submit Your Post!"
      >
        <p>{errorMessage}</p>
      </Modal>

      {/* Community Guidelines Modal will when openCommunityGuidelinesModal state is set to true */}
      <Modal
        data-testid='community-guidelines-modal'
        modalLabel='Please Accept To Continue'
        open={openCommunityGuidelinesModal}
        onRequestClose={() => setOpenCommunityGuidelinesModal(false)}
        modalHeading="Community Guidelines"
        primaryButtonText="Accept"
        secondaryButtonText="Cancel"
        onSecondarySubmit={() => setOpenCommunityGuidelinesModal(false)}
        onRequestSubmit={() => {
          setOpenCommunityGuidelinesModal(false);
          submit()
        }}
      >

        <pre className="formatted-blog-content" data-testid="blogContent" dangerouslySetInnerHTML={{ __html: communityGuidelines }} />
      </Modal>

      <br />

      {scopes.update_guidelines &&
        <ToggleSmall
          onToggle={() => {
            setEditCommunityGuidelines(!editCommunityGuidelines);
          }}
          data-testid='update-community-guidelines-toggle-toggle'
          aria-label="update community guidelines toggle toggle"
          id="update-community-guidelines-toggle-1"
          labelText="Update Community Guidelines"
        />}
    </form >
  );
}
