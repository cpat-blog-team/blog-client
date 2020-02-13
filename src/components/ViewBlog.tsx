import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlogPostInterface, emptyBlogPost, exampleBlogPost } from './exampleBlogPost';
import axios from 'axios';

interface Props {
  location: {
    id: string
  }
}

export default function WriteBlog({ location }: Props) {
  const { id } = location;
  const [blog, setBlog] = useState<BlogPostInterface>(emptyBlogPost());

  useEffect(() => {
    axios(`/blogs/blog?id=${id}`)
      .then(({ data }) => setBlog(data.blog))
      .catch(err => console.error(err));
  }, []);

  const { title, summary, username, date, content } = blog;
  return (
    <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="display-4" data-testid="blogTitle">{title}</h1>
        <p className="lead" data-testid="blogSummary">{summary}</p>
        <hr className="my-4"></hr>
        <div className="callout callout-info">
          <strong className="h4" data-testid="blogUsername">{username}</strong><br></br>
          <small className="text-muted" data-testid="blogDate">{date}</small>
        </div>
        <pre className="formated-blog-content" data-testid="blogContent">{content}</pre>
      </div>
    </div>
  );
}