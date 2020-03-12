import * as React from "react";
import WriteBlog from './components/WriteBlog';
import BlogList from './components/BlogList';
import ViewBlog from './components/ViewBlog'
import { Switch, Link, Route } from 'react-router-dom';

import './styles.scss';
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenu,
  HeaderMenuItem
} from "carbon-components-react/lib/components/UIShell";

export default function App() {
  return (
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
      {/* <div><Link to='/'>Home</Link></div>
      <div><Link to='/writeblog'>WriteBlog</Link></div>
      <a href="/appid/logout">Logout</a>
      <hr /> */}
      <Switch>
        <Route path='/writeblog' render={() => <WriteBlog />} />
        <Route path='/viewBlog' render={({ location }) => <ViewBlog location={location} />} />

        {/* Must be last route */}
        <Route path='/' render={() => <BlogList />} />
      </Switch>
    </div>
  );
}
