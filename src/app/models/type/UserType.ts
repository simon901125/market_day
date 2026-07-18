/** 使用者類型 */
export class UserType {
  /** 一般使用者 */
  static readonly user = '一般使用者';
  /** 攤主 */
  static readonly vendor = '攤主';
  /** 主辦方 */
  static readonly organizer = '主辦方';
  /** 管理員 */
  static readonly admin = '管理員';

  /** 角色 -> 標籤顏色 class 對應 */
  static readonly classMap: Record<string, string> = {
    [UserType.vendor]: 'purple',
    [UserType.organizer]: 'blue',
    [UserType.admin]: 'teal',
  };

  /** 取得角色對應的標籤顏色 class */
  static getClass(role: string): string {
    return UserType.classMap[role] ?? 'grey';
  }

  /** 後端 Role 的 API 值（英文 key，注意攤主是 vender）對應到前端顯示用的中文標籤。 */
  static readonly apiRoleMap: Record<string, string> = {
    admin: UserType.admin,
    organizer: UserType.organizer,
    vender: UserType.vendor,
  };

  /** 把後端回傳的 Role API 值轉成畫面用的中文標籤。 */
  static fromApiRole(role: string): string {
    return UserType.apiRoleMap[role] ?? role;
  }

  /** 把畫面上的中文角色標籤轉成要送給後端的 Role API 值。 */
  static toApiRole(label: string): string | null {
    const entry = Object.entries(UserType.apiRoleMap).find(([, value]) => value === label);
    return entry ? entry[0] : null;
  }
}