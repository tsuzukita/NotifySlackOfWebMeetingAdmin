import React, { useEffect, useState } from "react";
import SideNavigation from "./SideNavigation";
import UserList from "./UserList";

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  async function getAuthenticationInfo() {
    try {
      const response = await fetch('/.auth/me');
      const data = await response.json();
      const { clientPrincipal } = data;
      console.log(clientPrincipal);
      if (clientPrincipal) {
        setIsAuthorized(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    getAuthenticationInfo();
  }, []);

  return (
    <div className="app">
      <SideNavigation isAuthorized={isAuthorized} />

      {isAuthorized &&
        <div className="main-content">
          <UserList />
        </div>
      }
    </div>
  );
}

export default App;