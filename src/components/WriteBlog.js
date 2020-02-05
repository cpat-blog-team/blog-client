import React, { useState } from 'react';

export default function WriteBlog({ handleSubmit, username }) {

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  return(
    <div>
      <form>
        <div className="form-group">
          <label htmlFor="writeTitle">Title</label>
          <input 
            className="form-control" 
            id="writeTitle" 
            placeholder="title of your post" 
            data-testid="writeTitle"
            value={title || ""}
            onChange={e => {
              e.preventDefault()
              setTitle(e.target.value)
            }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="writeBlogPostText">Blog Text</label>
          <textarea 
            className="form-control" 
            id="writeBlogPostText" 
            rows="10" 
            data-testid="writeBlogPostText"
            value={text || ""}
            onChange={e => {
              e.preventDefault();
              setText(e.target.value);
            }}
          ></textarea>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary mb-2" 
          data-testid="submit"
          onClick={e => {
            e.preventDefault();
            handleSubmit({
              title,
              text,
              username
            })
          }}
        >Post</button>
      </form>
    </div>
  );
}