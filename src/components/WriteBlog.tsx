import * as React from 'react';
import { useState, useContext } from 'react';
import userContext from '../userContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { TextInput, Button } from "carbon-components-react";
const Delta = require('quill-delta');

interface Props { }

export default function WriteBlog(props: Props) {

  const [title, setTitle] = useState('');
  const [invalidTitle, setInvalidTitle] = useState(false);

  const [summary, setSummary] = useState('');
  const [invalidSummary, setInvalidSummary] = useState(false);

  const [content, setContent] = useState('<p><br></p>');
  const [invalidContent, setInvalidContent] = useState(false);

  const [delta, setDelta] = useState(new Delta());

  const { name, email } = useContext(userContext);

  const clearForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setDelta(new Delta());
  }

  const formatPost = () => ({
    email,
    name,
    title,
    summary,
    content: btoa(JSON.stringify(delta)),
    version: 1
  });

  const validateForm = () => {
    validateTitle(title);
    validateSummary(summary);
    validateContent(content);
  }

  const submit = () => {
    const blogPost = formatPost();
    axios.post('/blogs/add', JSON.stringify(blogPost), { headers: { 'Content-Type': 'application/json' } })
      .catch(err => console.error(err))
    clearForm();
  }

  const handleSubmit = () => {
    if (title && summary && content) submit()
    else validateForm()
  }

  const validateTitle = (value) => value ? setInvalidTitle(false) : setInvalidTitle(true);
  const validateSummary = (value) => value ? setInvalidSummary(false) : setInvalidSummary(true);
  const validateContent = (value) => value !== '<p><br></p>' ? setInvalidContent(false) : setInvalidContent(true);
  const validateContentOnBlur = ({ index }) => index > 0 ? setInvalidContent(false) : setInvalidContent(true);

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

  return (
    <form
      className="writeBlogContainer"
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
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
        />
        <div style={{ visibility: invalidContent ? 'visible' : 'hidden' }} className="bx--form-requirement" id="blogSummary-error-msg">Body is required</div>
      </div>
      <Button
        id="blogSubmit"
        data-testid="submit"
        type="submit"
        kind="primary"
      >Submit</Button>
    </form>
  );
}
