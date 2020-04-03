import * as React from 'react';
import userContext from '../userContext';
import { useState, useEffect, useContext } from 'react';
import { BlogPostInterface } from './exampleBlogPost';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'carbon-components-react';

interface Props { }

export default function BlogList(props: Props) {
  const history = useHistory();
  const { searchType, searchValue } = useParams();
  const { name: currentUsername } = useContext(userContext);
  // console.log('currentUsername', currentUsername);

  const [list, setList] = useState<BlogPostInterface[]>([]);

  const getQuery = () => {
    if (searchType) return `/blogs/search?${searchType}=${searchValue}`
    return '/blogs'
  }

  const getBlogs = () => {
    const query = getQuery()
    axios(query)
      .then(({ data }) => setList(data.blogs))
      .catch(err => console.error(err));
  }

  useEffect(() => {
    getBlogs()
  }, [searchValue]);

  return (
    <div>
      <div className="banner">
        <div className="banner-title">cpat blog</div>
        <h3>Bringing fellow cpat'ers together</h3>
      </div>
      <hr className="my-4"></hr>

      {list.map(({ title, summary, date, name, _id }, i) => (
        <div className="list-group list-group-accent" key={i} data-testid={`blogPost${i}`}>
          <div
            className="list-group-item list-group-item-accent-dark blog-list-container"
          >
            <div onClick={() => history.push(`/viewBlog/id=${_id}`)}>
              <h5>{title}</h5>
              <p>{summary}</p>
              <div>{name}</div>
              <div>{date}</div>
            </div>
            
            <div className="blog-list-component">
              {currentUsername === name && <Link href="#" onClick={() => history.push(`/writeBlog/id=${_id}`)}>Update</Link>}
            </div>
            
          </div>
        </div>
      ))}
    </div>
  );
}