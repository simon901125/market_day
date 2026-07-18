/** 使用者帳號停用/復原後，後端回傳的變更結果 */
export interface UserStatusChangeDto {
  userName: string;
  userEmail: string;
  newAccountStatus: string;
}
