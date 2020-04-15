import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPostInterface, emptyBlogPost } from './exampleBlogPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import axios from 'axios';

interface Props { }

export default function ViewBlog(props: Props) {
  const { _id } = useParams();
  const [blog, setBlog] = useState<BlogPostInterface>(emptyBlogPost());
  const [html, setHtml] = useState('');

  const loadBlog = ({ blog }) => {
    const content = JSON.parse(blog.content);
    const converter = new QuillDeltaToHtmlConverter(content.ops);
    setHtml(converter.convert());
    setBlog(blog);
  }

  useEffect(() => {
    axios(`/api/blogs/${_id}`)
      .then(({ data }) => loadBlog(data))
      .catch(err => console.error(err));
  }, []);

  const { title, summary, name, date } = blog;

  return (
    <div className="jumbotron jumbotron-fluid background-white">
      <div className="container">
        <h1 className="display-4" data-testid="blogTitle">{title}</h1>
        <p className="lead" data-testid="blogSummary">{summary}</p>
        <hr className="my-4"></hr>
        <div className="callout callout-info">
          <strong className="h4" data-testid="blogUsername">{name}</strong><br></br>
          <small className="text-muted" data-testid="blogDate">{date}</small>
        </div>
        <pre className="formatted-blog-content" data-testid="blogContent" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}