import * as React from 'react';
import { useState } from 'react';

interface Props {}

export default function BlogList (props: Props) {
  return (
    <div>
      <div className="banner">
        <div className="banner-title">cpat blog</div>
        <h3>Bringing fellow cpat'ers together</h3>
      </div>
      <div className="list-group list-group-accent">
        <div className="list-group-item list-group-item-accent-dark">
          <h5>Title</h5>
          <p>the text of the blog post</p>
        </div>
      </div>
    </div>
  );
}