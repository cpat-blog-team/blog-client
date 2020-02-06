import * as React from 'react';
import { useState, useEffect } from 'react';
import { exampleList, BlogPostInterface } from './exampleBlogPost';

interface Props {}

export default function BlogList (props: Props) {

  const [list, setList] = useState<BlogPostInterface[]>([]);

  useEffect(() => {
    //todo call api for list and invoke setList with list
    //... 

    //for now we will get our list from the examplList funcion
    const newList: BlogPostInterface[] = exampleList(8);
    setList(newList);
  }, []);

  return (
    <div>
      <div className="banner">
        <div className="banner-title">cpat blog</div>
        <h3>Bringing fellow cpat'ers together</h3>
      </div>
      {list.map(({title, summary, date, username}, i) => (
        <div className="list-group list-group-accent" key={i}>
          <div className="list-group-item list-group-item-accent-dark">
            <h5>{title}</h5>
            <p>{summary}</p>
            <div>{username}</div>
            <div>{date}</div>
          </div>
        </div>
        )
      )}
    </div>
  );
}