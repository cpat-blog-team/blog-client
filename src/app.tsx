import * as React from "react";

import { Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import WriteBlog from "./components/WriteBlog";
import BlogList from "./components/BlogList";
import ViewBlog from "./components/ViewBlog";


export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/writeBlog/id=:_id" component={WriteBlog} />
          <Route path="/writeBlog" component={WriteBlog} />
          <Route path="/viewBlog/id=:_id" component={ViewBlog} />
          <Route path="/blogList/:searchType/:searchValue" component={BlogList} />

          {/* Must be last route */}
          <Route path="/" component={BlogList} />
        </Switch>
      </div>
    </div>
  );
}
