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
  HeaderMenuItem
} from "carbon-components-react/lib/components/UIShell";

export default function NavBar() {
  const history = useHistory();
  const [sideNav, setSideNav] = useState(false);
  const [dropDownItems, setDropDownItems] = useState<string[]>([]);

  const { name, scopes } = useContext(userContext);
  const updateDropDownItems = () => {
    const dropDownItems: string[] = [];
    if (scopes.update_guidelines) dropDownItems.push('Community Guidelines');
    if (scopes.manage_blogs) dropDownItems.push('Blog Approval');
    if (scopes.manage_appid) dropDownItems.push('User Privileges');
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
        {dropDownItems.length > 0 &&
          <HeaderMenu aria-label="Admin Actions" menuLinkName="Admin Actions">
            <span data-testid="nav-bar-admin-actions">
              {dropDownItems.map((action, i) => (
                <HeaderMenuItem
                  key={i}
                  href="#"
                  data-testid={`Nav Bar ${action} Button`}
                >
                  {action}
                </HeaderMenuItem>
              ))}
            </span>
          </HeaderMenu>
        }
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
        </Switcher >

        {dropDownItems.length > 0 &&
          <span data-testid="side-nav-admin-actions">
            <Switcher aria-label="Admin Privileges Switcher">
              <p>Admin Actions</p>
              {scopes.update_guidelines &&
                <SwitcherItem
                  data-testid="side-nav-community-guidelines-button"
                  aria-label="Link 4"
                >
                  Community Guidelines
                </SwitcherItem>
              }
              {scopes.manage_appid &&
                <SwitcherItem
                  data-testid="side-nav-user-privileges-button"
                  aria-label="Link 5"
                >
                  User Privileges
                </SwitcherItem>
              }
              {scopes.manage_blogs &&
                <SwitcherItem
                  data-testid="side-nav-blog-approval-button"
                  aria-label="Link 6"
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