/** 管理員-主辦方使用者詳情 */
export interface AdminOrganizerDetail {
  /** 使用者唯一識別碼 */
  userId: number;
  detail: {
    /** 使用者基本資料 */
    userInfo: {
      /** 使用者名稱 */
      username: string;
      /** 使用者角色：主辦方 */
      role: string;
      /** 電子信箱 */
      email: string;
      /** 帳號狀態（啟用/停用） */
      accountStatus: string;
      /** 註冊時間 */
      registeredAt: string;
      /** 最後登入時間 */
      lastLoginAt: string;
      /** 建立活動總數 */
      createdActivityCount: number;
      /** 進行中活動數 */
      ongoingActivityCount: number;
      /** 已結束活動數 */
      endedActivityCount: number;
    };
    /** 主辦方詳細資料 */
    organizerInfo: {
      /** 主辦方名稱 */
      organizerName: string;
      /** 聯絡人姓名 */
      contactPerson: string;
      /** 聯絡電話 */
      contactPhone: string;
      /** 聯絡電子信箱 */
      contactEmail: string;
      /** 聯絡地址 */
      contactAddress: string;
      /** 公司名稱 */
      companyName: string;
      /** 統一編號 */
      taxId: string;
      /** 主辦方狀態 */
      organizerStatus: string;
    };
    /** 活動管理紀錄 */
    activityManagementRecords: {
      /** 總筆數（供分頁使用） */
      total: number;
      /** 紀錄列表 */
      items: {
        /** 活動名稱 */
        activityName: string;
        /** 活動日期 */
        activityDate: string;
        /** 活動狀態 */
        activityStatus: string;
        /** 報名人數（格式範例：120/150、55/55 等） */
        registrationCount: string;
      }[];
    };
    /** 登入紀錄 */
    loginRecords: {
      /** 總筆數（供分頁使用） */
      total: number;
      /** 紀錄列表 */
      items: {
        /** 登入時間 */
        loginTime: string;
        /** 登入方式（Email/Google 等） */
        loginMethod: string;
        /** 登入狀態（成功/失敗） */
        loginStatus: string;
      }[];
    };
  };
}
