import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlogPostInterface, emptyBlogPost, exampleBlogPost } from './exampleBlogPost';

interface Props {
  location: {
    id: string
  }
}

export default function WriteBlog({ location }: Props) {

  const [blog, setBlog] = useState<BlogPostInterface>(emptyBlogPost());

  useEffect(() => {
    //todo call api with location.id and invoke setBlog with blog recieved
    //... 

    //for now we will get our post from example post
    setBlog(exampleBlogPost);
  }, []);

  const { title, summary, username, date, content } = blog;
  return (
    <div className="jumbotron jumbotron-fluid">
      <div className="container">
        <h1 className="display-4">{title}</h1>
        <p className="lead">{summary}</p>
        <hr className="my-4"></hr>
        <div className="callout callout-info">
          <strong className="h4">{username}</strong><br></br>
          <small className="text-muted">{date}</small>
        </div>
        <pre className="formated-blog-content">{content}</pre>
      </div>
    </div>
  );
}