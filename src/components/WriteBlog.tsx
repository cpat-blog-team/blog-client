import * as React from 'react';
import { useState, useContext } from 'react';
import userContext from '../userContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { TextInput, Button } from "carbon-components-react";

interface Props { }

export default function WriteBlog(props: Props) {

  const [title, setTitle] = useState('');
  const [invalidTitle, setInvalidTitle] = useState(false);
  const [summary, setSummary] = useState('');
  const [invalidSummary, setInvalidSummary] = useState(false);
  const [content, setContent] = useState('');
  const { name, email } = useContext(userContext);

  const clearForm = () => {
    setTitle('');
    setSummary('');
    setContent('');
  }

  interface UserPost {
    title: string,
    summary: string,
    content: string
  }

  interface FormattedPost {
    name: string,
    email: string,
    title: string,
    summary: string,
    content: string,
    version: number
  }

  // todo: get username and userId from session storage
  const formatPost = () => ({
    email,
    name,
    title,
    summary,
    content,
    version: 1
  });

  const handleSubmit = () => {
    const blogPost = formatPost();
    axios.post('/blogs/add', JSON.stringify(blogPost), { headers: { 'Content-Type': 'application/json' } })
      .catch(err => console.error(err));

    clearForm();
  }

  const validateTitle = ({ value }) => value ? setInvalidTitle(false) : setInvalidTitle(true);
  const validateSummary = ({ value }) => value ? setInvalidSummary(false) : setInvalidSummary(true);

  const handleChangeTitle = ({ target }) => {
    setTitle(target.value);
    validateTitle(target);
  }
  const handleChangeSummary = ({ target }) => {
    setSummary(target.value);
    validateSummary(target);
  }
  const handleChangeContent = (content) => setContent(content);

  return (
    <form className="writeBlogContainer" onSubmit={handleSubmit} >
      <TextInput
        id="blogTitle"
        data-testid="writeTitle"
        name="title"
        labelText=""
        hideLabel
        onBlur={({ target }) => validateTitle(target)}
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
        onBlur={({ target }) => validateSummary(target)}
        value={summary}
        placeholder="Summary"
        invalid={invalidSummary ? true : false}
        invalidText="Summary is required"
        onChange={handleChangeSummary}
      />
      <div className="textEditorContainer" >
        <ReactQuill
          value={content}
          onChange={handleChangeContent} />
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
