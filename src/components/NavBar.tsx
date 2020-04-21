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
  SwitcherDivider,
  HeaderMenu,
  HeaderMenuItem,
} from "carbon-components-react/lib/components/UIShell";

import Dropdown from "carbon-components-react/lib/components/Dropdown";

export default function NavBar() {
  const history = useHistory();
  const [sideNav, setSideNav] = useState(false);
  const [dropDownItems, setDropDownItems] = useState<any[]>([]);

  const { name, scopes } = useContext(userContext);
  const updateDropDownItems = () => {
    const dropDownItems: any[] = [];
    if (scopes.update_guidelines) dropDownItems.push({'id' : dropDownItems.length + 1, 'text' : 'Community Guidelines', 'url' : '/communityGuidelines'});
    if (scopes.manage_blogs) dropDownItems.push({'id' : dropDownItems.length + 1, 'text' : 'Blog Approval', 'url' : '/'});
    if (scopes.manage_appid) dropDownItems.push({'id' : dropDownItems.length + 1, 'text' : 'User Privileges', 'url' : '/'});
    setDropDownItems(dropDownItems);
  };

  useEffect(() => {
    updateDropDownItems()
  }, [scopes]);

  return (
    <Header aria-label="IBM Platform Name" className="nav-box-shadow">
      <HeaderName href="/" prefix="IBM">CPAT Blog</HeaderName>
      <HeaderNavigation aria-label="IBM  CPAT Blog"></HeaderNavigation>

      <HeaderGlobalBar>
        <div style={{ width: 300, margin: "5px" }}>
          {dropDownItems.length > 0 &&
            <Dropdown 
            data-testid="nav-bar-admin-settings"
            id="dropdown-top-nav"
            label="Admin Settings"
            ariaLabel="Admin-Dropdown"
            titleText=""
            items={dropDownItems}
            itemToString={item => (item ? item.text : '')}
            onChange={e => history.push(e.selectedItem.url)}
            selectedItem={{'text' : 'Admin Settings'}}
          />}
        </div>
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
          <SwitcherItem aria-label="Link 1" href="/appid/logout">
            Log out <ArrowRight20 fill="white" />
          </SwitcherItem>
          <SwitcherDivider />
        </Switcher >


        {dropDownItems.length > 0 &&
          <span data-testid="side-nav-admin-actions">
            <Switcher aria-label="Admin Privileges Switcher">
              <h5>Admin Settings</h5>
              <SwitcherDivider />
              {scopes.update_guidelines &&
                <SwitcherItem
                  data-testid="side-nav-community-guidelines-button"
                  aria-label="Link 4"
                  onClick={() => history.push("/communityGuidelines")}
                >
                  Community Guidelines
                </SwitcherItem>
              }
              {scopes.manage_appid &&
                <SwitcherItem
                  data-testid="side-nav-user-privileges-button"
                  aria-label="Link 5"
                  onClick={() => history.push("/")}
                >
                  User Privileges
                </SwitcherItem>
              }
              {scopes.manage_blogs &&
                <SwitcherItem
                  data-testid="side-nav-blog-approval-button"
                  aria-label="Link 6"
                  onClick={() => history.push("/")}
                >
                  Blog Approval
                </SwitcherItem>
              }
            </Switcher>
          </span>
        }
      </HeaderPanel>
    </Header >
  );
}