/** 管理員-使用者管理列表項目 */
export interface UserListItem {
    /** 使用者 id */
    id: number;
    /** 使用者名稱 */
    name: string;
    /**email */
    email: string;
    /**角色 */
    role: string;
    /**註冊時間 */
    createdAt: string;
    /**最後登入 */
    lastLoginAt: string;
    /**帳號狀態 */
    status: string;
}