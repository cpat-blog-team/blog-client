import * as React from 'react';
import { useState } from 'react';
import { User20, Edit20, ArrowRight20 } from '@carbon/icons-react';
import { useHistory } from 'react-router-dom';
import SearchBlog from './SearchBlog'

import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
} from "carbon-components-react/lib/components/UIShell";

export default function NavBar() {
  const history = useHistory();
  const [sideNav, setSideNav] = useState(false);

  return (
    <Header aria-label="IBM Platform Name" className="nav-box-shadow">
      <HeaderName href="/" prefix="IBM">CPAT Blog</HeaderName>
      <HeaderNavigation aria-label="IBM  CPAT Blog"></HeaderNavigation>
      <HeaderGlobalBar>
        <SearchBlog />
        <HeaderGlobalAction
          aria-label="Edit"
          onClick={() => history.push('/writeBlog')}
        >
          <Edit20 fill="white" />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label="User"
          onClick={() => setSideNav(sideNav ? false : true)}>
          <User20 />
        </HeaderGlobalAction>
      </HeaderGlobalBar>

      <HeaderPanel aria-label="Header Panel" expanded={sideNav}>
        <Switcher aria-label="Switcher Container">
          <SwitcherItem href="#" aria-label="Link 2">
            My Blog Posts
            </SwitcherItem>
          <SwitcherItem
            aria-label="Link 3"
            onClick={() => history.push('/writeBlog')}
          >
          </SwitcherItem>
          <SwitcherDivider />
          <SwitcherItem aria-label="Link 1" href="/appid/logout">
            Log out <ArrowRight20 fill="white" />
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </Header>
  );
}