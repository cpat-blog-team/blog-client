import * as React from "react";

import { Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import WriteBlog from "./components/WriteBlog";
import BlogList from "./components/BlogList";
import ViewBlog from "./components/ViewBlog";
import ApproveBlog from "./components/ApproveBlog";
import communityGuidelines from "./components/CommunityGuidelines";
import ManageAppID from './components/ManageAppID'

export default function App() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/userPrivileges" component={ManageAppID} />
          <Route path="/communityGuidelines" component={communityGuidelines} />
          <Route path="/writeBlog/id=:_id" component={WriteBlog} />
          <Route path="/writeBlog" component={WriteBlog} />
          <Route path="/viewBlog/id=:_id" component={ViewBlog} />
          <Route path="/blogList/:searchType/:searchValue" component={BlogList} />
          <Route path="/approveBlog/id=:_id" component={ApproveBlog} />
          {/* Must be last route */}
          <Route path="/" component={BlogList} />
        </Switch>
      </div>
    </div>
  );
}
