import * as React from 'react';
import { useQuill } from 'react-quilljs';

import 'quill/dist/quill.snow.css'; // Add css for snow theme

export default function TextEditor () {
    const { quill, quillRef } = useQuill();
   
    return (
      <div className="textEditorContainer">
        <div ref={quillRef} />
      </div>
    );
};

