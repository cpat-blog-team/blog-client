import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import userContext from '../userContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { useHistory } from 'react-router-dom';
import { Button, Modal, ToggleSmall } from "carbon-components-react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

const Delta = require('quill-delta');

interface Props { }

export default function CommunityGuidelines(props: Props) {
  const history = useHistory();

  const [content, setContent] = useState('<p><br></p>');
  const [invalidContent, setInvalidContent] = useState(false);

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');

  const [delta, setDelta] = useState(new Delta());
  const [errorMessage, setErrorMessage] = useState('');
  const [editCommunityGuidelines, setEditCommunityGuidelines] = useState(false);

  const { scopes } = useContext(userContext);


  const loadCommunityGuidelines = ({ content, name, date, title }) => {
    let { ops } = JSON.parse(content);
    const converter = new QuillDeltaToHtmlConverter(ops);
    setContent(converter.convert());
    setName(name);
    setTitle(title);
    setDate(date)
  }

  useEffect(() => {
    axios(`/api/communityGuidelines`)
      .then(({ data }) => loadCommunityGuidelines(data.communityGuidelines))
      .catch(err => console.error(err));
  }, []);

  const formatPost = () => ({
    content: JSON.stringify(delta),
    version: 1
  });

  const clearForm = () => {
    setContent('');
    setDelta(new Delta());
  }

  const submit = () => {
    const communityGuidelinesPost = formatPost();
    axios.post('/api/communityGuidelines', JSON.stringify({ content: communityGuidelinesPost.content }), { headers: { 'Content-Type': 'application/json' } })
      .then(() => submitSuccess())
      .catch(({ response }) => submitFail(response));
  }

  const submitSuccess = () => {
    clearForm();
    history.push('/');
  }

  const submitFail = ({ status, statusText }) => {
    if (status === 413) {
      setErrorMessage("Image too large. Please use different image!");
    }
    else setErrorMessage(statusText);
  }

  const handleSubmit = () => {
    if (!invalidContent) submit();
  }

  const validateContent = (value) => value.replace(/<[^>]*>/g, "") !== '' ? setInvalidContent(false) : setInvalidContent(true);
  const validateContentOnBlur = () => content ? setInvalidContent(false) : setInvalidContent(true);

  const handleChangeContent = (content, delta, source, editor) => {
    setContent(content);
    validateContent(content);
    setDelta(editor.getContents());
  }

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]

  return (
    <div>
      {editCommunityGuidelines
        ? (
          <form
            className="writeCommunityGuidelines"
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit();
            }}
          >
            <div data-testid="writeContent" className="textEditorContainer" >
              <ReactQuill
                className={invalidContent ? "bx--text-input--invalid" : ""}
                value={content}
                onBlur={validateContentOnBlur}
                onChange={handleChangeContent}
                modules={modules}
                formats={formats}
              />
            </div>
            <br />
            <Button
              id="communityGuidelineSubmit"
              data-testid="submit"
              type="submit"
              kind="primary"
            >Submit</Button>
            {/* Error Modal will open automatically when errorMessage state is set */}
            <Modal
              modalLabel='Error'
              open={errorMessage ? true : false}
              onRequestClose={() => setErrorMessage('')}
              passiveModal
              modalHeading="Sorry We Couldn't Submit Your Post!"
            >
              <p>{errorMessage}</p>
            </Modal>
          </form >
        ) : (
          <div className="container">
            <h1 className="display-4" data-testid="blogTitle">{title}</h1>
            <hr className="my-4"></hr>
            <div className="callout callout-info">
              <strong className="h4" data-testid="blogUsername">{name}</strong><br></br>
              <small className="text-muted" data-testid="blogDate">{date}</small>
            </div>
            <pre className="formatted-blog-content" data-testid="blogContent" dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        )
      }

      {scopes.update_guidelines &&
        <div className="row-content-to-right">
          <ToggleSmall
            onToggle={() => {
              setEditCommunityGuidelines(!editCommunityGuidelines);
            }}
            data-testid='update-community-guidelines-toggle-toggle'
            aria-label="update community guidelines toggle toggle"
            id="update-community-guidelines-toggle-1"
            labelText="Update Community Guidelines"
          />
        </div>
      }
    </div>
  );
}
