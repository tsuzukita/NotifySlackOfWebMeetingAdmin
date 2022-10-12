import React from "react";
import { Link } from "react-router-dom";

const redirect = window.location.pathname;
const baseUrl = '/.auth'; 
const loginUrl = `${baseUrl}/login/aad?post_login_redirect_uri=${redirect}`;
const logoutUrl = `${baseUrl}/logout?post_logout_redirect_uri=${redirect}`;

function SideNavigation({isAuthorized}) {
  return (
    <div className="side-navigation">
      {isAuthorized?
        <a href={logoutUrl}><button>ログアウト</button></a>:
        <a href={loginUrl}><button>ログイン</button></a>
      }
      <nav className="side-navigation-link-container">
        <ul>
          <li>
            <Link to="/">ユーザー一覧</Link>
          </li>
          <li>
            <Link to="/add">ユーザー追加</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default SideNavigation;