import React, { useState } from "react";
import { API_URL } from "./constants";

const AddUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  /**
   * ユーザー名変更時のイベントハンドラ
   */
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  /**
   * メールアドレス変更時のイベントハンドラ
   */
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  /**
   * ユーザー追加時のイベントハンドラ
   */
  const handleSubmitUser = async () => {
    const requestBody = {
      name: username,
      emailAddress: email,
    };

    try {
      await fetch(`${API_URL}/Users`, {
        mode: "cors",
        method: "POST",
        body: JSON.stringify(requestBody),
      });

      // リクエスト送信に成功したら、入力をクリアする
      setUsername("");
      setEmail("");
      setError(false);
    } catch (e) {
      console.error(e);
      setError(true);
    }
  };

  return (
    <div className="add-user">
      <div className="mt-3">
        <label className="form-label">ユーザー名</label>
        <input
          className="form-control"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="mt-3">
        <label className="form-label"> メールアドレス</label>
        <input
          className="form-control"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <button
        className="mt-3 btn btn-primary"
        disabled={!username || !email}
        onClick={handleSubmitUser}
      >
        追加
      </button>
      {error && (
        <div className="add-user-error">ユーザーの追加に失敗しました</div>
      )}
    </div>
  );
};

export default AddUser;