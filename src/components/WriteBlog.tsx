import * as React from 'react';
import { useState, useContext } from 'react';
import userContext from '../userContext';
import axios from 'axios';

import TextEditor from './TextEditor';

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

      <TextEditor />

      {/* <form
        onSubmit={e => {
          e.preventDefault();
          const formattedPost = formatPost({ title, summary, content });
          handleSubmit(formattedPost);
        }}
      >
        <div className="form-group">
          <label htmlFor="writeTitle">Title</label>
          <input
            className="form-control"
            id="writeTitle"
            placeholder=""
            data-testid="writeTitle"
            value={title || ""}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="writeSummary">Summary</label>
          <input
            className="form-control"
            id="writeSummary"
            placeholder=""
            data-testid="writeSummary"
            value={summary || ""}
            onChange={e => setSummary(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="writeContent">Blog Content</label>
          <textarea
            className="form-control"
            id="writeContent"
            rows={10}
            data-testid="writeContent"
            value={content || ""}
            onChange={e => setContent(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary mb-2"
          data-testid="submit"
        >Post</button>
      </form> */}
    </div>
  );
}
