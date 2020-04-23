import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BlogPostInterface, emptyBlogPost } from './exampleBlogPost';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import axios from 'axios';
import { Modal, Select, SelectItem, TextArea, Button } from 'carbon-components-react';

interface Props { }

export default function ApproveBlog(props: Props) {
  const { _id } = useParams();
  const [blog, setBlog] = useState<BlogPostInterface>(emptyBlogPost());
  const [html, setHtml] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [comment, setComment] = useState('');

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

  const submitReview = () => {

  };

  const { title, summary, name, date } = blog;
  const items = ['Approve', 'Reject']

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
      <div className="row-content-to-right">
        <Button
          onClick={() => setOpenModal(true)}
        >
          Review
      </Button>
      </div>
      {/* Approve Modal will open automatically when openModal state is set to true*/}
      <Modal
        open={openModal}
        onRequestClose={() => setOpenModal(false)}
        modalHeading="Blog Approval"
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        onSecondarySubmit={() => setOpenModal(false)}
        onRequestSubmit={() => submitReview()}
      >
        <Select id="select-1" labelText="Status">
          <SelectItem
            hidden
            value="placeholder-item"
            text="Set approval status"
          />
          <SelectItem value="option-1" text="Approve" />
          <SelectItem value="option-2" text="Reject" />
        </Select>
        <br></br>
        <TextArea
          labelText="Comments"
        >
        </TextArea>
      </Modal>
    </div>
  );
}