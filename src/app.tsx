import * as React from "react";
import { useState, useEffect } from "react";
import userContext from "./userContext";
import axios from "axios";

import { Switch, Route } from "react-router-dom";
import NavBar from './components/NavBar'
import WriteBlog from "./components/WriteBlog";
import BlogList from "./components/BlogList";
import ViewBlog from "./components/ViewBlog";


export default function App() {
  const [userData, setUserData] = useState({ name: "", email: "", roles: {} });

  const getUserData: any = async () => {
    try {
      const { data } = await axios("/user");
      setUserData(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  return (
    <userContext.Provider value={userData}>
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
    </userContext.Provider>
  );
}
