import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';

interface Props { }

export default function WriteBlog(props: Props) {

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');

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

  const handleSubmit = (blogPost: UserPost) => {
    axios.post('/blog/add', JSON.stringify(blogPost))
    // .catch(err => console.error(err))

    clearForm();
  }

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit({
            title,
            summary,
            content
          });
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
      </form>
    </div>
  );
}
