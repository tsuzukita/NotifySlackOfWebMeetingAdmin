import React, { useEffect, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { API_URL } from "./constants";

function UserList() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

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

    /**
 * 選択中のユーザーを削除する
 */
    async function deleteUser() {
        const url = `${API_URL}/Users/${selectedUserIds.join(",")}`;
        try {
            // 通信の前にクライアント側のユーザーリストを更新する
            setUsers(users.filter((user) => !selectedUserIds.includes(user.id)));
            await fetch(url, { mode: "cors", method: "DELETE" });
            setSelectedUserIds([]);
        } catch (e) {
            // 削除に失敗した場合はリロードを促す
            console.error(e);
            if (!alert("削除に失敗しました。ページを再読み込みしてください。")) {
                window.location.reload();
            }
        }
    }

    const handleSelectAllUser = (event) => {
        // ユーザーの一括選択、解除を行う
        // 全てのユーザーを選択済みなら選択を解除する
        if (!event.target.checked) {
            setSelectedUserIds([]);
        } else {
            setSelectedUserIds(users.map((user) => user.id));
        }
    };

    const handleSelectUser = (event) => {
        const targetUserId = event.target.value;
        if (selectedUserIds.includes(event.target.value)) {
            setSelectedUserIds(
                selectedUserIds.filter((userId) => userId !== targetUserId)
            );
        } else {
            setSelectedUserIds([...selectedUserIds, targetUserId]);
        }
    };

    useEffect(() => {
        getUserList();
    }, []);

    return (
        <div className="user-list">
            <div className="user-list-header">
                <div className="user-list-filter">
                    <input className="form-control" type="text" />
                    <button className="user-list-filter-button btn btn-secondary">
                        フィルタ
                    </button>
                </div>
            </div>
            <div className="user-delete-button-wrapper">
                <button
                    className="user-delete-button btn btn-secondary"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#delete-user-confirm-dialog"
                    disabled={selectedUserIds.length === 0}
                >
                    削除
                </button>
            </div>

            <div className="user-list-grid-header">
                <div className="user-list-grid-item">
                    <input
                        type="checkbox"
                        checked={
                            selectedUserIds.length > 0 &&
                            selectedUserIds.length === users.length
                        }
                        onChange={handleSelectAllUser}
                    />
                </div>
                <div className="user-list-grid-item">ユーザー名</div>
                <div className="user-list-grid-item">メールアドレス</div>
                <div className="user-list-grid-item">認可トークン</div>
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
                <div className="user-list-grid-item-container">
                    {users.map((user) => (
                        <React.Fragment key={user.id}>
                            <div className="user-list-grid-item">
                                <input
                                    type="checkbox"
                                    checked={selectedUserIds.includes(user.id)}
                                    value={user.id}
                                    onChange={handleSelectUser}
                                />
                            </div>
                            <div className="user-list-grid-item">{user.name}</div>
                            <div className="user-list-grid-item">{user.emailAddress}</div>
                            <div className="user-list-grid-item">{user.authorizationKey}</div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <ConfirmDialog
                dialogId="delete-user-confirm-dialog"
                title="確認"
                message="ユーザーを削除しますか？"
                onOKClick={deleteUser}
            />
        </div>
    );
}

export default UserList;