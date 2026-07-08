/** 管理員-攤主使用者詳情 */
export interface AdminVendorDetail {
  /** 使用者唯一識別碼 */
  userId: number;
  detail: {
    /** 使用者基本資料 */
    userInfo: {
      /** 使用者名稱 */
      username: string;
      /** 使用者角色：攤主 */
      role: string;
      /** 電子信箱 */
      email: string;
      /** 帳號狀態（啟用/停用） */
      accountStatus: string;
      /** 註冊時間 */
      registeredAt: string;
      /** 最後登入時間 */
      lastLoginAt: string;
      /** 報名活動總次數 */
      registrationCount: number;
      /** 已完成活動數 */
      completedEventCount: number;
    };
    /** 攤主詳細資料 */
    vendorInfo: {
      /** 品牌名稱 */
      brandName: string;
      /** 品牌類型（食品/手作等） */
      brandType: string;
      /** 負責人姓名 */
      owner: string;
      /** 聯絡電話 */
      contactPhone: string;
      /** 聯絡電子信箱 */
      contactEmail: string;
      /** 聯絡地址 */
      contactAddress: string;
    };
    /** 活動報名紀錄 */
    activityRegistrationRecords: {
      /** 總筆數（供分頁使用） */
      total: number;
      /** 紀錄列表 */
      items: {
        /** 活動名稱 */
        activityName: string;
        /** 報名日期 */
        registrationDate: string;
        /** 報名狀態 */
        registrationStatus: string;
        /** 付款狀態 */
        paymentStatus: string;
        /** 攤位（若為 null 顯示 "-"） */
        booth: string | null;
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
