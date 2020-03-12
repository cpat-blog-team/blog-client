import * as React from "react";
import { useState, useEffect } from "react";
import userContext from "./userContext";
import axios from "axios";

import { Switch, Link, Route } from "react-router-dom";
import WriteBlog from "./components/WriteBlog";
import BlogList from "./components/BlogList";
import ViewBlog from "./components/ViewBlog";

import "./styles.scss";
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem
} from "carbon-components-react/lib/components/UIShell";

export default function App() {
  const [userData, setUserData] = useState({ name: "", email: "" });
  useEffect(() => {
    const getUserData: any = async () => {
      const { data } = await axios.get("/user");
      console.log(data);
      setUserData(data);
    };
    getUserData();
  }, []);

  return (
    <userContext.Provider value={userData}>
      <div className="container">
        <Header aria-label="IBM Platform Name">
          <HeaderName href="#" prefix="IBM">
            [Platform]
          </HeaderName>
          <HeaderNavigation aria-label="IBM [Platform]">
            <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
            <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
            <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
            <HeaderMenu aria-label="Link 4" menuLinkName="Link 4">
              <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
              <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
              <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
            </HeaderMenu>
          </HeaderNavigation>
        </Header>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <Link to="/writeblog">WriteBlog</Link>
        </div>
        <a href="/appid/logout">Logout</a>
        <hr />

        <Switch>
          <Route path="/writeblog" component={WriteBlog} />
          <Route
            path="/viewBlog"
            render={({ location }) => <ViewBlog location={location} />}
          />

          {/* Must be last route */}
          <Route path="/" component={BlogList} />
        </Switch>
      </div>
    </userContext.Provider>
  );
}
