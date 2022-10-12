import React, { useEffect, useState } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SideNavigation from "./SideNavigation";
import AddUser from "./AddUser";
import UserList from "./UserList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "", element: <UserList /> },
      { path: "add", element: <AddUser /> },
    ],
  },
]);

function Root() {
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
    <>
      <SideNavigation isAuthorized={isAuthorized} />

      {isAuthorized &&
        <div className="main-content">
          <Outlet  />
        </div>
      }
    </>
  );
}

function App() {
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;