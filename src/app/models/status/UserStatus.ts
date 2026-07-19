/** 使用者帳號狀態 */
export class UserStatus {
  /** 正常 */
  static readonly active = '正常';
  /** 已停用 */
  static readonly disabled = '已停用';
  /** 未激活，畫面篩選下拉沒有這個選項，僅用於表格顯示 */
  static readonly unactive = '未激活';
  /** 已刪除，畫面篩選下拉沒有這個選項，僅用於表格顯示 */
  static readonly isDelete = '已刪除';

  /** 使用者帳號狀態 -> 標籤顏色 class 對應 */
  static readonly classMap: Record<string, string> = {
    [UserStatus.active]: 'green',
    [UserStatus.disabled]: 'red',
    [UserStatus.unactive]: 'yellow',
    [UserStatus.isDelete]: 'grey',
  };

  /** 取得帳號狀態對應的標籤顏色 class */
  static getClass(status: string): string {
    return UserStatus.classMap[status] ?? 'grey';
  }

  /** 後端 UserStatus 的 API 值（英文 key）對應到前端顯示用的中文標籤。 */
  static readonly apiStatusMap: Record<string, string> = {
    active: UserStatus.active,
    disabled: UserStatus.disabled,
    unactive: UserStatus.unactive,
    isDelete: UserStatus.isDelete,
  };

  /** 把後端回傳的 UserStatus API 值轉成畫面用的中文標籤。 */
  static fromApiStatus(status: string): string {
    return UserStatus.apiStatusMap[status] ?? status;
  }

  /** 把畫面上的中文狀態標籤轉成要送給後端的 UserStatus API 值。 */
  static toApiStatus(label: string): string | null {
    const entry = Object.entries(UserStatus.apiStatusMap).find(([, value]) => value === label);
    return entry ? entry[0] : null;
  }
}