import * as React from 'react';
import { useState } from 'react';

interface Props {}

export default function WriteBlog (props: Props) {

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const clearForm = () => {
    setTitle('');
    setText('');
  }

  const handleSubmit = (blogPost: {title: string, text: string}) => {
    //to be implemented, post to api
    //...

    clearForm();
  }

  return(
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSubmit({
            title,
            text
          });
        }}
      >
        <div className="form-group">
          <label htmlFor="writeTitle">Title</label>
          <input 
            className="form-control" 
            id="writeTitle" 
            placeholder="title of your post" 
            data-testid="writeTitle"
            value={title || ""}
            onChange={e => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="writeText">Blog Text</label>
          <textarea 
            className="form-control" 
            id="writeText" 
            rows={10}
            data-testid="writeText"
            value={text || ""}
            onChange={e => setText(e.target.value)}
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary mb-2" 
          data-testid="submit"
        >Post</button>
      </form>
    </div>
  );
}
