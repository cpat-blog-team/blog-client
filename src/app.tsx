import * as React from "react";
import WriteBlog from './components/WriteBlog';
import BlogList from './components/BlogList';
import ViewBlog from './components/ViewBlog'
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
        <Route path='/viewBlog' render={({ location }) => <ViewBlog location={location} />} />
      </Switch>
    </div>
  );
}
