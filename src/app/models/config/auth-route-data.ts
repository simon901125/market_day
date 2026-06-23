/**
 * Auth 路由共用資料。
 *
 * 同一組 Auth 元件會依 role / mode 切換：
 * - 攤主登入、註冊、Email 驗證、忘記密碼、重設密碼
 * - 主辦方登入、註冊、Email 驗證、忘記密碼、重設密碼
 */
export const AUTH_ROUTE_DATA = {
  /** 攤主登入 */
  vendorLogin: {
    role: 'vendor',
    mode: 'login',
    sidebarComponent: 'vendor',
    title: '歡迎回來，',
    highlight: '一起打造精彩的市集時光',
    description: '登入你的攤主帳號，管理你的市集活動與專屬攤位。',
    topText: '還沒有帳號？',
    topLinkText: '前往註冊',
    topLink: '/vendor/register',
    formTitle: '攤主登入',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
    forgotLink: '/vendor/forgot-password',
  },

  /** 攤主註冊 */
  vendorRegister: {
    role: 'vendor',
    mode: 'register',
    sidebarComponent: 'vendor',
    title: '加入小集日，',
    highlight: '讓更多人看見你的品牌',
    description: '建立攤主帳號，開始報名市集活動，拓展你的品牌曝光。',
    topText: '已經有帳號了？',
    topLinkText: '前往登入',
    topLink: '/vendor/login',
    formTitle: '攤主註冊',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
    vertifyLink: '/vendor/verify-email',
    verifyLink: '/vendor/verify-email',
  },

  /** 攤主 Email 驗證 */
  vendorVerifyEmail: {
    role: 'vendor',
    mode: 'verify',
    title: '請完成 Email 驗證',
    highlight: 'Email 驗證',
    description: '輸入發送到信箱的 6 位數驗證碼，完成攤主帳號驗證。',
    topText: '已經有帳號了？',
    topLinkText: '前往登入',
    topLink: '/vendor/login',
    formTitle: '請輸入 Email 驗證碼',
    backLink: '/vendor/register',
    loginLink: '/vendor/login',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
  },

  /** 攤主忘記密碼 */
  vendorForgotPassword: {
    role: 'vendor',
    mode: 'forgot',
    title: '忘記密碼了嗎？',
    highlight: '不用擔心，我們協助你重設',
    description: '輸入註冊 Email，我們會寄送驗證碼協助你重新設定密碼。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/vendor/login',
    formTitle: '忘記密碼',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
    vertifyLink: '/vendor/verify-email',
    verifyLink: '/vendor/verify-email',
  },

  /** 攤主重設密碼 */
  vendorResetPassword: {
    role: 'vendor',
    mode: 'reset',
    title: '重新設定密碼',
    highlight: '設定新的登入密碼',
    description: '請輸入新密碼並再次確認，完成後即可重新登入攤主平台。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/vendor/login',
    formTitle: '重設密碼',
    loginLink: '/vendor/login',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
  },

  /** 主辦方登入 */
  organizerLogin: {
    role: 'organizer',
    mode: 'login',
    sidebarComponent: 'organizer',
    title: '歡迎回來，',
    highlight: '管理你的市集活動',
    description: '登入主辦方後台，建立活動、審核報名並管理攤位資訊。',
    topText: '還沒有帳號？',
    topLinkText: '前往註冊',
    topLink: '/organizer/register',
    systemName: '主辦方後台',
    formTitle: '主辦方登入',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
    forgotLink: '/organizer/forgot-password',
  },

  /** 主辦方註冊 */
  organizerRegister: {
    role: 'organizer',
    mode: 'register',
    sidebarComponent: 'organizer',
    title: '加入小集日，',
    highlight: '一起打造更好的市集體驗',
    description: '建立主辦方帳號，開始規劃活動並招募適合的攤主。',
    topText: '已經有主辦方帳號了？',
    topLinkText: '前往登入',
    topLink: '/organizer/login',
    systemName: '主辦方後台',
    formTitle: '主辦方註冊',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
    vertifyLink: '/organizer/verify-email',
    verifyLink: '/organizer/verify-email',
  },

  /** 主辦方 Email 驗證 */
  organizerVerifyEmail: {
    role: 'organizer',
    mode: 'verify',
    title: '請完成 Email 驗證',
    highlight: 'Email 驗證',
    description: '輸入發送到信箱的 6 位數驗證碼，完成主辦方帳號驗證。',
    topText: '已經有帳號了？',
    topLinkText: '前往登入',
    topLink: '/organizer/login',
    formTitle: '請輸入 Email 驗證碼',
    backLink: '/organizer/register',
    loginLink: '/organizer/login',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
  },

  /** 主辦方忘記密碼 */
  organizerForgotPassword: {
    role: 'organizer',
    mode: 'forgot',
    title: '忘記密碼了嗎？',
    highlight: '不用擔心，我們協助你重設',
    description: '輸入註冊 Email，我們會寄送驗證碼協助你重新設定密碼。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/organizer/login',
    formTitle: '忘記密碼',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
    vertifyLink: '/organizer/verify-email',
    verifyLink: '/organizer/verify-email',
  },

  /** 主辦方重設密碼 */
  organizerResetPassword: {
    role: 'organizer',
    mode: 'reset',
    title: '重新設定密碼',
    highlight: '設定新的登入密碼',
    description: '請輸入新密碼並再次確認，完成後即可重新登入主辦方後台。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/organizer/login',
    formTitle: '重設密碼',
    loginLink: '/organizer/login',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
  },

  /** 主辦方通知中心 */
  organizerDashBoardNotification: {
    data: {
      role: 'organizer',
    },
  },

  /** 攤主通知中心 */
  vendorDashBoardNotification: {
    data: {
      role: 'vendor',
    },
  },
};
