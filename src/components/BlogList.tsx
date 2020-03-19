import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

interface Props { title: string }

export default function BlogList({ title }: Props) {
  const history = useHistory();

  const [list, setList] = useState<BlogPostInterface[]>([]);

  const searchByTitle = (title) => {
    axios(`/blogs/search?title=${title}`)
      .then(({ data }) => setList(data.blogs))
      .catch(err => console.error(err));
  }

  const getAllBlogs = () => {
    axios("/blogs")
      .then(({ data }) => setList(data.blogs))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    if (title) searchByTitle(title)
    else getAllBlogs()
  }, []);

  return (
    <div>
      <div className="banner">
        <div className="banner-title">cpat blog</div>
        <h3>Bringing fellow cpat'ers together</h3>
      </div>

      {list.map(({ title, summary, updatedAt, name, _id }, i) => (
        <div className="list-group list-group-accent" key={i} data-testid={`blogPost${i}`}>
          <div
            onClick={() => history.push('/viewBlog', { _id })}
            className="list-group-item list-group-item-accent-dark blog-list-container"
          >
            <h5>{title}</h5>
            <p>{summary}</p>
            <div>{name}</div>
            <div>{updatedAt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}