import * as React from 'react';

import { Link } from 'react-router-dom'

import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem
} from "carbon-components-react/lib/components/UIShell";

export default function NavBar() {
  return (
    <Header aria-label="IBM Platform Name">
      <HeaderName href="#" prefix="IBM">
        CPAT Blog
          </HeaderName>
      <HeaderNavigation aria-label="IBM  CPAT Blog">
        <Link className="bx--header__menu-item" to="/">Home</Link>
        <Link className="bx--header__menu-item" to="/writeblog">WriteBlog</Link>
        <HeaderMenuItem href="/appid/logout">Logout</HeaderMenuItem>
      </HeaderNavigation>
    </Header>
  );
}