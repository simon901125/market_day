/**
 * Auth 頁面設定檔
 *
 * 統一管理：
 * - 攤主登入 / 註冊 / 驗證信箱 / 忘記密碼 / 重設密碼
 * - 主辦方登入 / 註冊 / 驗證信箱 / 忘記密碼 / 重設密碼
 *
 * app.routes.ts 僅負責路由設定，
 * 畫面顯示文字、Logo、連結等資訊統一由此檔案管理。
 */
export const AUTH_ROUTE_DATA = {
  /** 攤主登入*/
  vendorLogin: {
    role: 'vendor',
    mode: 'login',
    sidebarComponent: 'vendor',
    title: '登入',
    highlight: '攤主後台',
    description: '登入你的攤主帳號，\n管理你的市集活動。',
    topText: '還沒有帳號？',
    topLinkText: '前往註冊',
    topLink: '/vendor/register',
    formTitle: '攤主登入',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
    forgotLink: '/vendor/forgot-password',
  },
  /** 攤主註冊*/
  vendorRegister: {
    role: 'vendor',
    mode: 'register',
    sidebarComponent: 'vendor',
    title: '加入小集日，\n開啟你的',
    highlight: '市集旅程',
    description: '建立攤主帳號，開始參與市集活動，\n讓更多人看見你的品牌與好物。',
    topText: '已經有帳號了？',
    topLinkText: '前往登入',
    topLink: '/vendor/login',
    formTitle: '攤主註冊',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
  },
  /** 攤主Email驗證*/
  vendorVerifyEmail: {
    role: 'vendor',
    mode: 'verify',
    title: '請完成',
    highlight: 'Email 驗證',
    description: '輸入寄送到信箱的 6 位數驗證碼，\n完成攤主帳號驗證。',
    topText: '已經有帳號了？',
    topLinkText: '前往登入',
    topLink: '/vendor/login',
    formTitle: '請輸入 Email 驗證碼',
    backLink: '/vendor/register',
    loginLink: '/vendor/login',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
  },
  /** 攤主忘記密碼*/
  vendorForgotPassword: {
    role: 'vendor',
    mode: 'forgot',
    title: '忘記密碼了嗎？',
    highlight: '',
    description: '輸入註冊 Email，\n我們會寄送重設密碼驗證碼至你的信箱。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/vendor/login',
    formTitle: '忘記密碼',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
    verifyLink: '/vendor/verify-email',
  },
  /** 攤主重設密碼*/
  vendorResetPassword: {
    role: 'vendor',
    mode: 'reset',
    title: '重新設定密碼',
    highlight: '',
    description: '請輸入新密碼並確認新密碼，\n完成後即可重新登入攤主平台。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/vendor/login',
    formTitle: '重設密碼',
    loginLink: '/vendor/login',
    logoImg: '/assets/images/logo/logo-market-day-vendor.png',
  },
  /** 主辦方登入*/
  organizerLogin: {
    role: 'organizer',
    mode: 'login',
    sidebarComponent: 'organizer',
    title: '登入',
    highlight: '主辦方後台',
    description: '登入你的主辦方帳號，\n管理你的市集與活動。',
    topText: '還沒有主辦方帳號？',
    topLinkText: '前往註冊',
    topLink: '/organizer/register',
    systemName: '主辦方後台',
    formTitle: '主辦方登入',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
    forgotLink: '/organizer/forgot-password',
  },
  /** 主辦方註冊*/
  organizerRegister: {
    role: 'organizer',
    mode: 'register',
    sidebarComponent: 'organizer',
    title: '加入小集日，\n開啟你的',
    highlight: '主辦方後台',
    description: '建立主辦方帳號，開始建立與管理市集活動。',
    topText: '已經有主辦方帳號了？',
    topLinkText: '前往登入',
    topLink: '/organizer/login',
    systemName: '主辦方後台',
    formTitle: '主辦方註冊',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
  },
  /** 主辦方Email驗證*/
  organizerVerifyEmail: {
    role: 'organizer',
    mode: 'verify',
    title: '請完成',
    highlight: 'Email 驗證',
    description: '輸入寄送到信箱的 6 位數驗證碼，\n完成主辦方帳號驗證。',
    topText: '已經有帳號了？',
    topLinkText: '前往登入',
    topLink: '/organizer/login',
    formTitle: '請輸入 Email 驗證碼',
    backLink: '/organizer/register',
    loginLink: '/organizer/login',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
  },
  /** 主辦方忘記密碼*/
  organizerForgotPassword: {
    role: 'organizer',
    mode: 'forgot',
    title: '忘記密碼了嗎？',
    highlight: '',
    description: '輸入註冊 Email，\n我們會寄送重設密碼驗證碼至你的信箱。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/organizer/login',
    formTitle: '忘記密碼',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
    verifyLink: '/organizer/verify-email',
  },
  /** 主辦方重設密碼*/
  organizerResetPassword: {
    role: 'organizer',
    mode: 'reset',
    title: '重新設定密碼',
    highlight: '',
    description: '請輸入新密碼並確認新密碼，\n完成後即可重新登入主辦方後台。',
    topText: '想起密碼了？',
    topLinkText: '返回登入',
    topLink: '/organizer/login',
    formTitle: '重設密碼',
    loginLink: '/organizer/login',
    logoImg: '/assets/images/logo/logo-market-day-organizer.png',
  },
  /** 主辦方後台通知列 */
  organizerDashBoardNotification: {
    data: {
      role: 'organizer',
    },
  },
  /** 攤主後台通知列 */
  vendorDashBoardNotification: {
    data: {
      role: 'vendor',
    },
  },
};
