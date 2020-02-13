import * as React from 'react';
import { useState, useEffect } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import SearchBlog from './SearchBlog';

interface Props { }

export default function BlogList(props: Props) {

  const [selectedPostID, setSelectedPostID] = useState('');
  const [list, setList] = useState<BlogPostInterface[]>([]);

  useEffect(() => {
    axios("/blog/all")
      .then(({ data }) => setList(data.blogs))
      .catch(err => console.error(err));
  }, []);

  const search = async (title) => {
    await axios(`/blog/search?title=${title}`)
      .then(({ data }) => setList(data.blogs))
      .catch(err => console.error(err));
  }

  return (
    //if A post has been selected we will redirect to blogView passing the ID of the selected post
    selectedPostID ? <Redirect to={{ pathname: '/viewBlog', id: selectedPostID }} /> :

      <div>
        <SearchBlog search={search} />
        <div className="banner">
          <div className="banner-title">cpat blog</div>
          <h3>Bringing fellow cpat'ers together</h3>
        </div>

        {list.map(({ title, summary, date, username, id }, i) => (
          <div className="list-group list-group-accent" key={i} data-testid={`blogPost${i}`}>
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