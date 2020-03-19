import * as React from 'react';
import { useState, useContext } from 'react';
import userContext from '../userContext';
import axios from 'axios';

import TextEditor from './TextEditor';
import { TextInput } from "carbon-components-react";

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

  const handleSubmit = (blogPost: FormattedPost) => {
    axios.post('/blogs/add', JSON.stringify(blogPost), { headers: { 'Content-Type': 'application/json' } })
      .catch(err => console.error(err));

    clearForm();
  }

  return (
    <div className="writeBlogContainer">
      <TextInput id="blogTitle" labelText="" hideLabel 
        placeholder="Blog Post Title" invalid={false} 
        invalidText="Title is required" onChange={e => setTitle(e.target.value)}/>
      <TextInput id="blogSummary" labelText="" hideLabel 
        placeholder="Summary" invalid={false} 
        invalidText="Summary is required" onChange={e => setSummary(e.target.value)}/>
      <TextEditor />
    </div>
  );
}
