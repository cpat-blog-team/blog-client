import * as React from 'react';
import { useState, useContext, useEffect } from 'react';
import { Menu20, Close20, Edit20, ArrowRight20 } from '@carbon/icons-react';
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
  const [dropDownItems, setDropDownItems] = useState<any[]>([]);

  const { name, scopes } = useContext(userContext);
  const updateDropDownItems = () => {
    const dropDownItems: any[] = [];
    if (scopes.update_guidelines) dropDownItems.push({ 'text': 'Update Guidelines', 'route': '/communityGuidelines' });
    if (scopes.manage_blogs) dropDownItems.push({ 'text': 'Blog Approval', 'route': '/blogList/approved/Pending' });
    if (scopes.manage_appid) dropDownItems.push({ 'text': 'User Privileges', 'route': '/userPrivileges' });
    setDropDownItems(dropDownItems);
  };

  useEffect(() => {
    updateDropDownItems()
  }, [scopes]);

  const redirect = (url) => {
    history.push(url);
    setSideNav(false);
  }
  return (
    <Header aria-label="IBM Platform Name" className="nav-box-shadow">
      <HeaderName href="/" prefix="IBM">CPAT Blog</HeaderName>
      <HeaderNavigation aria-label="IBM  CPAT Blog">
        {dropDownItems.length > 0 &&
          <HeaderMenu aria-label="Admin Actions" menuLinkName="Admin Actions">
            <span data-testid="nav-bar-admin-actions">
              {dropDownItems.map(({ text, route }, idx) => (
                <HeaderMenuItem
                  key={idx}
                  href={route}
                  data-testid={`Nav Bar ${text} Button`}
                >
                  {text}
                </HeaderMenuItem>
              ))}
            </span>
          </HeaderMenu>
        }
      </HeaderNavigation>

      <HeaderGlobalBar>
        <SearchBlog />
        <HeaderGlobalAction
          data-testid="nav-bar-write-blog-button"
          aria-label="Edit"
          onClick={() => redirect("/writeBlog")}
        >
          <Edit20 fill="white" />
        </HeaderGlobalAction>
        <HeaderGlobalAction
          aria-label="User"
          onClick={() => setSideNav(sideNav ? false : true)}>
          {!sideNav && <Menu20 />}
          {sideNav && <Close20 />}
        </HeaderGlobalAction>
      </HeaderGlobalBar>

      <HeaderPanel aria-label="Header Panel" expanded={sideNav}>
        <Switcher aria-label="Switcher Container">
          <SwitcherDivider />
          <SwitcherItem
            data-testid="side-nav-my-blog-posts-button"
            onClick={() => redirect(`/blogList/username/${name}`)}
            aria-label="Link 2"
          >
            My Blog Posts
          </SwitcherItem>
          <SwitcherItem
            data-testid="side-nav-write-a-blog-button"
            aria-label="Link 3"
            onClick={() => redirect("/writeBlog")}
          >
            Write A Blog
          </SwitcherItem>
          <SwitcherItem
            data-testid="side-nav-community-guidelines-button"
            aria-label="Link 7"
            onClick={() => redirect("/communityGuidelines")}
          >
            Community Guidelines
          </SwitcherItem>
          <SwitcherDivider />
        </Switcher >

        {dropDownItems.length > 0 &&
          <span data-testid="side-nav-admin-actions">
            <Switcher aria-label="Admin Privileges Switcher">
              <h6>Admin Actions</h6>
              <SwitcherDivider />
              {scopes.manage_blogs &&
                <SwitcherItem
                  data-testid="side-nav-blog-approval-button"
                  aria-label="Link 6"
                  href="/blogList/approved/Pending"
                >
                  Blog Approval
                </SwitcherItem>
              }
              {scopes.manage_appid &&
                <SwitcherItem
                  data-testid="side-nav-user-privileges-button"
                  aria-label="Link 5"
                  href="/userPrivileges"
                >
                  User Privileges
                </SwitcherItem>
              }
              {scopes.update_guidelines &&
                <SwitcherItem
                  data-testid="side-nav-update-guidelines-button"
                  aria-label="Link 4"
                  href="/communityGuidelines"
                >
                  Update Guidelines
                </SwitcherItem>
              }
            </Switcher>
          </span>
        }

        <Switcher>
          <SwitcherDivider />
          <SwitcherItem aria-label="Link 1" href="/appid/logout">
            Log out <ArrowRight20 fill="white" />
          </SwitcherItem>
        </Switcher>
      </HeaderPanel>
    </Header >
  );
}