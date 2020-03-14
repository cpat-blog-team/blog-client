import * as React from 'react';
import { Link } from 'react-router-dom'
import { User20, Edit20, Search20, ArrowRight20 } from '@carbon/icons-react';

import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider,
} from "carbon-components-react/lib/components/UIShell";

export default function NavBar() {
  const [sideNav, setSideNav] = React.useState(false);
  return (
    <Header aria-label="IBM Platform Name">
      <HeaderName href="/" prefix="IBM">CPAT Blog</HeaderName>
      <HeaderNavigation aria-label="IBM  CPAT Blog"></HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Search" onClick={() => {}}>
          <Search20 />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="Edit">
          <Link to="/writeblog"><Edit20 fill="white"/></Link>
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
            <SwitcherItem aria-label="Link 3">
              <Link className="writePostNavLink" to="/writeblog">Write Post</Link>
            </SwitcherItem>
            <SwitcherDivider />
            <SwitcherItem aria-label="Link 1" href="/appid/logout">
              Log out <ArrowRight20 fill="white"/>
            </SwitcherItem>
          </Switcher>
      </HeaderPanel>
    </Header>
  );
}