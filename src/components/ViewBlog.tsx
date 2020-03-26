import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { BlogPostInterface, emptyBlogPost } from './exampleBlogPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'; 

import axios from 'axios';

interface Props { }

export default function WriteBlog(props: Props) {
  const { _id } = useParams();
  const [blog, setBlog] = useState<BlogPostInterface>(emptyBlogPost());
  const [html, setHtml] = useState('');

  useEffect(() => {
    axios(`/blogs/${_id}`)
      .then(({ data }) => {
        const content = JSON.parse(atob(data.blog.content));
        const converter = new QuillDeltaToHtmlConverter(content.ops);
        setHtml(converter.convert());
        setBlog(data.blog);
      })
      .catch(err => console.error(err));
  }, []);

  const { title, summary, name, updatedAt } = blog;

  return (
    <div className="jumbotron jumbotron-fluid background-white">
      <div className="container">
        <h1 className="display-4" data-testid="blogTitle">{title}</h1>
        <p className="lead" data-testid="blogSummary">{summary}</p>
        <hr className="my-4"></hr>
        <div className="callout callout-info">
          <strong className="h4" data-testid="blogUsername">{name}</strong><br></br>
          <small className="text-muted" data-testid="blogDate">{updatedAt}</small>
        </div>
        <pre className="formatted-blog-content" data-testid="blogContent" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}