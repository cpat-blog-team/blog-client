import * as React from 'react';
import { useState, useEffect } from 'react';
import { exampleList, BlogPostInterface } from './exampleBlogPost';
import { Redirect } from 'react-router-dom';

interface Props { }

export default function BlogList(props: Props) {
  const newList: BlogPostInterface[] = exampleList(8);
  const [selectedPostID, setSelectedPostID] = useState('');
  const [list, setList] = useState<BlogPostInterface[]>(newList);

  useEffect(() => {
    fetch("http://localhost:3000/blog/all")
    .then(res => res.json())
    .then(blogs => {
      setList(blogs);
    });


  }, []);

  return (
    //if A post has been selected we will redirect to blogView passing the ID of the selected post
    selectedPostID ? <Redirect to={{ pathname: '/viewBlog', id: selectedPostID }} /> :

      <div>
        <div className="banner">
          <div className="banner-title">cpat blog</div>
          <h3>Bringing fellow cpat'ers together</h3>
        </div>
        {list.map(({ title, summary, date, username, id }, i) => (
          <div className="list-group list-group-accent" key={i}>
            <div
              onClick={() => { setSelectedPostID(id) }}
              className="list-group-item list-group-item-accent-dark blog-list-container"
            >
              <h5>{title}</h5>
              <p>{summary}</p>
              <div>{username}</div>
              <div>{date}</div>
            </div>
          </div>
        ))}
      </div>
  );
}