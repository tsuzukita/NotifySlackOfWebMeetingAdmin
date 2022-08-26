import React from "react";

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
      <h5>ユーザー 一覧 </h5>
    </div>
  );
}

export default SideNavigation;