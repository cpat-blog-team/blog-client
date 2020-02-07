import * as React from "react";
import WriteBlog from './components/WriteBlog';
import BlogList from './components/BlogList';
import { Switch, Link, Route } from 'react-router-dom';

export default function App() {
  return (
    <div className="container">
      <div><Link to='/'>Home</Link></div>
      <div><Link to='/writeblog'>WriteBlog</Link></div>

      <hr />
      <Switch>
        <Route exact path='/' render={() => <BlogList />} />
        <Route path='/writeblog' render={() => <WriteBlog />} />
      </Switch>
    </div>
  );
}
