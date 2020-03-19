import * as React from "react";
import { useState, useEffect } from "react";
import userContext from "./userContext";
import axios from "axios";

import { Switch, Route, useParams } from "react-router-dom";
import NavBar from './components/NavBar'
import WriteBlog from "./components/WriteBlog";
import BlogList from "./components/BlogList";
import ViewBlog from "./components/ViewBlog";

export default function App() {
  const [userData, setUserData] = useState({ name: "", email: "" });

  useEffect(() => {
    const getUserData: any = async () => {
      const { data } = await axios.get("/user");
      setUserData(data);
    };
    getUserData();
  }, []);

  const TitleRoute: any = ({ component: Component, ...rest }) => {
    const { title } = useParams();
    return <Route {...rest} component={() => <Component title={title} />} />
  }

  return (
    <userContext.Provider value={userData}>
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/writeblog" component={WriteBlog} />
          <Route path="/viewBlog" component={ViewBlog} />
          <TitleRoute path="/blogList/:title" component={(props) => <BlogList {...props} />} />

          {/* Must be last route */}
          <Route path="/" component={BlogList} />
        </Switch>
      </div>
    </userContext.Provider>
  );
}
