import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { User20, Edit20, ArrowRight20 } from '@carbon/icons-react';
import { useHistory } from 'react-router-dom';
import SearchBlog from './SearchBlog';
import userContext from '../userContext';

import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderPanel,
  Switcher,
  SwitcherItem,
  SwitcherDivider
} from "carbon-components-react/lib/components/UIShell";
import { Dropdown } from 'carbon-components-react';

export default function NavBar() {
  const history = useHistory();
  const [sideNav, setSideNav] = useState(false);
  const [dropDownItems, setDropDownItems] = useState<string[]>([]);

  const { name, scopes } = useContext(userContext);
  const updateDropDownItems = async () => {
    console.log('scopes', scopes)
    const dropDownItems: string[] = [];
    if (scopes.update_guidelines) dropDownItems.push('Community Guidelines');
    if (scopes.manage_blogs) dropDownItems.push('Blog Approval');
    if (scopes.manage_appid) dropDownItems.push('User Privileges');
    await setDropDownItems(dropDownItems);
  };

  useEffect(() => {
    updateDropDownItems()
  }, [scopes]);

  return (
    <Header aria-label="IBM Platform Name" className="nav-box-shadow">
      <HeaderName href="/" prefix="IBM">CPAT Blog</HeaderName>
      <HeaderNavigation aria-label="IBM  CPAT Blog"></HeaderNavigation>

      <HeaderGlobalBar>
        <Dropdown
          data-testid="admin-actions-dropDown"
          type="inline"
          ariaLabel="Admin Actions"
          id="admin-actions"
          items={dropDownItems}
          label="Select Mode"
          titleText="Admin Access - "
        />
        <SearchBlog />
        <HeaderGlobalAction
          data-testid="nav-bar-write-blog-button"
          aria-label="Edit"
          onClick={() => history.push("/writeBlog")}
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
          <SwitcherItem
            data-testid="side-nav-my-blog-posts-button"
            onClick={() => history.push(`/blogList/username/${name}`)}
            aria-label="Link 2"
          >
            My Blog Posts
          </SwitcherItem>
          <SwitcherItem
            data-testid="side-nav-write-a-blog-button"
            aria-label="Link 3"
            onClick={() => history.push("/writeBlog")}
          >
            Write A Blog
          </SwitcherItem>
          <SwitcherDivider />
          <SwitcherItem aria-label="Link 1" href="/appid/logout">
            Log out <ArrowRight20 fill="white" />
          </SwitcherItem>

          <SwitcherDivider />
          <p> - Admin Access - </p>
          {scopes.community_guidelines &&
            <SwitcherItem
              data-testid="side-nav-community-guidelines-button"
              aria-label="Link 3"
            // onClick={() => history.push("/writeBlog")}
            >
              Community Guidelines
          </SwitcherItem>}
          {scopes.manage_appid &&
            <SwitcherItem
              data-testid="side-nav-user-privileges-button"
              aria-label="Link 3"
            // onClick={() => history.push("/writeBlog")}
            >
              User Privileges
          </SwitcherItem>}
          {scopes.manage_blogs &&
            <SwitcherItem
              data-testid="side-nav-blog-approval-button"
              aria-label="Link 3"
            // onClick={() => history.push("/writeBlog")}
            >
              Blog Approval
          </SwitcherItem>}
        </Switcher>
      </HeaderPanel>
    </Header >
  );
}