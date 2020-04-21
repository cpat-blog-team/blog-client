import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import userContext from '../userContext';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { useHistory, useParams } from 'react-router-dom';
import { TextInput, Button, Modal, ToggleSmall } from "carbon-components-react";
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

const Delta = require('quill-delta');

interface Props { }

export default function CommunityGuidelines(props: Props) {
  const history = useHistory();

  const [content, setContent] = useState('<p><br></p>');
  const [invalidContent, setInvalidContent] = useState(false);

  const [delta, setDelta] = useState(new Delta());
  const [errorMessage, setErrorMessage] = useState('');
  const [openCommunityGuidelinesModal, setOpenCommunityGuidelinesModal] = useState(false);

  const { _id } = useParams();
  const { scopes } = useContext(userContext);


  const loadCommunityGuidelines = ({ content }) => {
    let { ops } = JSON.parse(content);
    const converter = new QuillDeltaToHtmlConverter(ops);
    setContent(converter.convert());
  }

  useEffect(() => {
    axios(`/api/communityGuidelines`)
      .then(({ data }) => {
          console.log(data.communityGuidelines)
        loadCommunityGuidelines(data.communityGuidelines)
      })
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

  const validateForm = () => {
    validateContent(content);
  }

  const submit = () => {
    const communityGuidelinesPost = formatPost();

    axios.post('/api/communityGuidelines', JSON.stringify({ content: communityGuidelinesPost.content }), { headers: { 'Content-Type': 'application/json' } })
    .then(() => submitSuccess())
    .catch(({ response }) => submitFail(response))
    
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
    if (content) {
      submit();
    }
    else validateForm();
  }

  const validateContent = (value) => value !== '<p><br></p>' ? setInvalidContent(false) : setInvalidContent(true);
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
  );
}
