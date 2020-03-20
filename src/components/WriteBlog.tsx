import * as React from 'react';
import { useState, useContext } from 'react';
import userContext from '../userContext';
import axios from 'axios';

import TextEditor from './TextEditor';
import { FormGroup, TextInput, Button } from "carbon-components-react";
import { isCompositeComponent } from 'react-dom/test-utils';

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
  const formatPost = (blogPost: UserPost) => ({
    email,
    name,
    title: blogPost.title,
    summary: blogPost.summary,
    content: blogPost.content,
    version: 1
  });

  const handleSubmit = () => {
    // console.log(title, summary)
    // axios.post('/blogs/add', JSON.stringify(blogPost), { headers: { 'Content-Type': 'application/json' } })
    //   .catch(err => console.error(err));

    // clearForm();
  }

  const validateTitle = () => title ? setInvalidTitle(false) : setInvalidTitle(true);

  const validateSummary = () => summary ? setInvalidSummary(false) : setInvalidSummary(true);

  const handleChangeTitle = ({ target }) => { 
    setTitle(target.value);
    validateTitle();
  }

  const handleChangeSummary = ({ target }) => { 
    setSummary(target.value);
    validateSummary();
  }


  return (
    <form className="writeBlogContainer" onSubmit={ handleSubmit } >
      <TextInput id="blogTitle" name="title" labelText="" hideLabel onBlur={validateTitle} value={title}
        placeholder="Blog Post Title" invalid={ invalidTitle ? true : false }
        invalidText="Title is required" onChange={ handleChangeTitle }/>
      <br/>
      <br/>
      <TextInput id="blogSummary" name="summary" labelText="" hideLabel value={summary}
        placeholder="Summary" invalid={ invalidSummary ? true : false} onBlur={validateSummary}
        invalidText="Summary is required" onChange={ handleChangeSummary } />
      <TextEditor />
      <Button type="submit" id="blogSubmit" kind="primary">Submit</Button>
    </form>
  );
}
