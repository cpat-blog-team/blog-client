import * as React from "react";
import { useState, useEffect } from "react";
import axios from 'axios'

import { Switch, Link, Route } from 'react-router-dom';
import WriteBlog from './components/WriteBlog';
import BlogList from './components/BlogList';
import ViewBlog from './components/ViewBlog'

export default function App() {
  interface User {
    name: string,
    email: string
  }
  const emptyUser = {
    name: '',
    email: ''
  }
  const [userData, setUserData] = useState(emptyUser);

  useEffect(() => {
    const getUserData: any = async () => {
      const { data } = await axios.get('/user');
      console.log(data)
      setUserData(data);
    }
    getUserData()
  }, []);

  return (
    <div className="container">
      <div><Link to='/'>Home</Link></div>
      <div><Link to='/writeblog'>WriteBlog</Link></div>
      <a href="/appid/logout">Logout</a>
      <hr />

      <Switch>
        <Route path='/writeblog' render={() => <WriteBlog />} />
        <Route path='/viewBlog' render={({ location }) => <ViewBlog location={location} />} />

        {/* Must be last route */}
        <Route path='/' render={() => <BlogList />} />
      </Switch>
    </div>
  );
}
