import React from "react";
import SideNavigation from "./SideNavigation";
import UserList from "./UserList";

function App() {
  return (
    <div className="app">
      <SideNavigation />

      <div className="main-content">
        <UserList />
      </div>
    </div>
  );
}

export default App;