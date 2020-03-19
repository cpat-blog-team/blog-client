import * as React from 'react';
import { useState, useContext } from 'react';
import userContext from '../userContext';
import axios from 'axios';

import TextEditor from './TextEditor';
import { TextInput, Button } from "carbon-components-react";


interface Props { }

export default function WriteBlog(props: Props) {

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
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

  return (
    <div className="writeBlogContainer">
      <TextInput id="blogTitle" labelText="" hideLabel 
        placeholder="Blog Post Title" invalid={title ? false : true} 
        invalidText="Title is required" onChange={e => setTitle(e.target.value)}/>
      <TextInput id="blogSummary" labelText="" hideLabel 
        placeholder="Summary" invalid={summary ? false : true} 
        invalidText="Summary is required" onChange={e => setSummary(e.target.value)}/>
      <TextEditor />
      <Button id="blogSubmit" kind="primary" onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
