import * as React from "react";
import userContext from "../userContext";
import { useState, useEffect, useContext } from "react";
import { BlogPostInterface } from "./exampleBlogPost";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import { Link, Modal } from "carbon-components-react";

interface Props { }

export default function BlogList(props: Props) {
  const history = useHistory();
  const { searchType, searchValue } = useParams();
  const { name: currentUsername } = useContext(userContext);

  const [list, setList] = useState<BlogPostInterface[]>([]);
  const [deleteId, setDeleteId] = useState("");

  const getQuery = () => {
    if (searchType) return `/api/blogs/search?${searchType}=${searchValue}`;
    return "/api/blogs";
  };

  const getBlogs = async () => {
    try {
      const query = getQuery();
      const { data } = await axios(query);
      setList(data.blogs);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBlog = async () => {
    console.log(`deleting blog ${deleteId}`);
    await axios.delete(`/api/blogs/${deleteId}`);
    setDeleteId("");
    getBlogs();
  };

  useEffect(() => {
    getBlogs();
  }, [searchValue]);

  return (
    <div>
      <div className="banner">
        <div className="banner-title">cpat blog</div>
        <h3>Bringing fellow cpat'ers together</h3>
      </div>
      <hr className="my-4"></hr>

      {list.map(({ title, summary, date, name, _id }, i) => (
        <div
          className="list-group list-group-accent"
          key={i}
          data-testid={`blogPost${i}`}
        >
          <div className="list-group-item list-group-item-accent-dark blog-list-container">
            <div onClick={() => history.push(`/viewBlog/id=${_id}`)}>
              <h5>{title}</h5>
              <p>{summary}</p>
              <div>{name}</div>
              <div>{date}</div>
            </div>

            <div className="blog-list-component">
              {currentUsername === name && (
                <Link
                  href={`/writeBlog/id=${_id}`}
                  data-testid={`updateLink${i}`}
                >
                  Update
                </Link>
              )}
              {currentUsername === name && (
                <Link
                  href="#"
                  data-testid={`deleteLink${i}`}
                  onClick={() => setDeleteId(_id)}
                >
                  Delete
                </Link>
              )}
              {searchType === 'approved' && (
                <Link
                  href={`/approveBlog/id=${_id}`}
                  data-testid={`reviewLink${i}`}
                >
                  Review
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}
      {/* Error Modal will open automatically when errorMessage state is set */}
      <Modal
        open={deleteId ? true : false}
        onRequestClose={() => setDeleteId("")}
        modalHeading="Are you sure you want to delete this blog?"
        primaryButtonText="Yes"
        secondaryButtonText="Cancel"
        onSecondarySubmit={() => setDeleteId("")}
        onRequestSubmit={() => deleteBlog()}
      >
      </Modal>
    </div>
  );
}
