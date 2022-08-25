import React, { useEffect, useState } from "react";
import { API_URL } from "./constants";

function UserList() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * AzureDBからユーザーリストを取得する
   */
  async function getUserList() {
    const url = `${API_URL}/Users`;
    try {
      setIsLoading(true);
      const response = await fetch(url, { mode: "cors" });
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <div className="user-list">
      <div className="user-list-header">
        <input className="form-control" type="text" />
        <button className="user-list-header-button btn btn-secondary">
          フィルタ
        </button>
      </div>

      <div className="user-list-grid-header">
        <div className="user-list-grid-item">ユーザー名</div>
        <div className="user-list-grid-item">メールアドレス</div>
      </div>
      <div className="user-list-grid">
        {isLoading && (
          <div className="user-list-grid-loading">
            <div className="user-list-grid-loading-message">Loading</div>
            <div className="spinner-grow user-list-grid-loading-dot" />
            <div className="spinner-grow user-list-grid-loading-dot" />
            <div className="spinner-grow user-list-grid-loading-dot" />
          </div>
        )}
        {users.map((user) => (
          <React.Fragment key={user.id}>
            <div className="user-list-grid-item">{user.name}</div>
            <div className="user-list-grid-item">{user.emailAddress}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default UserList;