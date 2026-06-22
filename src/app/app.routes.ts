import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/frontend/user-layout/user-layout';
import { UserHome } from './modules/user/frontend/user-home/user-home';
import { UserActivityList } from './modules/user/frontend/activity/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/frontend/activity/user-activity-detail/user-activity-detail';
import { UserBrandDetail } from './modules/user/frontend/brand/user-brand-detail/user-brand-detail';
import { AdminLogin } from './modules/admin/dashboard/admin-login/admin-login';
import { AdminDashboardHome } from './modules/admin/dashboard/admin-dashboard-home/admin-dashboard-home';
import { AdminDashboardNotification } from './modules/admin/dashboard/admin-dashboard-notification/admin-dashboard-notification';
import { AdminDashboardMarketManagemant } from './modules/admin/dashboard/admin-dashboard-market-managemant/admin-dashboard-market-managemant';
import { AdminDashboardMarketDetail } from './modules/admin/dashboard/admin-dashboard-market-detail/admin-dashboard-market-detail';
import { AdminDashboardUserManagement } from './modules/admin/dashboard/admin-dashboard-user-management/admin-dashboard-user-management';
import { AdminDashboardLogs } from './modules/admin/dashboard/admin-dashboard-logs/admin-dashboard-logs';
import { Auth } from './modules/auth/auth/auth';
import { UserAboutUs } from './modules/user/frontend/user-about-us/user-about-us';
import { OrganizerDashboardHome } from './modules/organizer/dashboard/organizer-dashboard-home/organizer-dashboard-home';
import { OrganizerDashboardNotification } from './modules/organizer/dashboard/organizer-dashboard-notification/organizer-dashboard-notification';
import { OrganizerDashboardSetupGuide } from './modules/organizer/dashboard/organizer-dashboard-setup-guide/organizer-dashboard-setup-guide';
import { OrganizerEventManagement } from './modules/organizer/dashboard/organizer-event-management/organizer-event-management';
import { OrganizerHome } from './modules/organizer/frontend/organizer-home/organizer-home';
import { OrganizerAbout } from './modules/organizer/frontend/organizer-about/organizer-about';
import { UserBrandSearch } from './modules/user/frontend/brand/user-brand-search/user-brand-search';

//--- vendor ----
import { VendorHome } from './modules/vendor/frontend/vendor-home/vendor-home';
import { VendorDashboardHome } from './modules/vendor/dashboard/vendor-dashboard-home/vendor-dashboard-home';
import { VendorDashboardNotification } from './modules/vendor/dashboard/vendor-dashboard-notification/vendor-dashboard-notification';
import { VendorAbout } from './modules/vendor/frontend/vendor-about/vendor-about';
import { VendorMarketSignupList } from './modules/vendor/frontend/vendor-market-signup-list/vendor-market-signup-list';
import { VendorMarketSignupDetail } from './modules/vendor/frontend/vendor-market-signup-detail/vendor-market-signup-detail';
import { VendorSignupForm } from './modules/vendor/frontend/vendor-signup-form/vendor-signup-form';
import { VendorSignupConfirmPage } from './modules/vendor/frontend/vendor-signup-confirm-page/vendor-signup-confirm-page';
import { VendorSignupCompletePage } from './modules/vendor/frontend/vendor-signup-complete-page/vendor-signup-complete-page';
import { VendorAccountSettings } from './modules/vendor/dashboard/vendor-account-settings/vendor-account-settings';
import { VendorPasswordSettings } from './modules/vendor/dashboard/vendor-password-settings/vendor-password-settings';
import { VendorDashboardStall } from './modules/vendor/dashboard/vendor-dashboard-stall/vendor-dashboard-stall';
import { VendorApplicationRecord } from './modules/vendor/dashboard/vendor-application-record/vendor-application-record';
import { VendorApplicationDetail } from './modules/vendor/dashboard/vendor-application-detail/vendor-application-detail';

/** 頁面設定檔 */
import { AUTH_ROUTE_DATA } from './config/auth-route-data';
import { DashboardLayout } from './modules/shared/dashboard/dashboard-layout/dashboard-layout';

export const routes: Routes = [
  /** 預設導向 */
  {
    path: '',
    redirectTo: 'user/home',
    pathMatch: 'full',
  },

  /** 一般使用者前台 */
  {
    path: 'user',
    component: UserLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: UserHome,
      },
      {
        path: 'activity-list',
        component: UserActivityList,
      },
      {
        path: 'activity-list/history',
        component: UserActivityList,
      },
      {
        path: 'activity-detail',
        component: UserActivityDetail,
      },
      {
        path: 'brands',
        component: UserBrandSearch,
      },
      {
        path: 'brand-detail',
        component: UserBrandDetail,
      },
      {
        path: 'about',
        component: UserAboutUs,
      },
    ],
  },

  /** 攤主專區登入 / 註冊 / 驗證 */
  {
    path: 'vendor',
    children: [
      { path: 'home', component: VendorHome },
      { path: 'about', component: VendorAbout },
      { path: 'sign-up', component:VendorMarketSignupList },
      { path: 'sign-up-detail', component:VendorMarketSignupDetail },
      { path: 'sign-up-form',component:VendorSignupForm }, 
      { path: 'sign-up-confirm', component:VendorSignupConfirmPage },
      { path: 'sign-up-complete', component: VendorSignupCompletePage },
      { path: 'login', component: Auth, data: AUTH_ROUTE_DATA.vendorLogin },
      { path: 'register', component: Auth, data: AUTH_ROUTE_DATA.vendorRegister },
      { path: 'forgot-password', component: Auth, data: AUTH_ROUTE_DATA.vendorForgotPassword },
      { path: 'verify-email', component: Auth, data: AUTH_ROUTE_DATA.vendorVerifyEmail },
      { path: 'reset-password', component: Auth, data: AUTH_ROUTE_DATA.vendorResetPassword },
    ],
  },
  /** 主辦方專區登入 / 註冊 / 驗證 */
  {
    path: 'organizer',
    children: [
      { path: 'home', component: OrganizerHome },
      { path: 'about', component: OrganizerAbout },
      { path: 'login', component: Auth, data: AUTH_ROUTE_DATA.organizerLogin },
      { path: 'register', component: Auth, data: AUTH_ROUTE_DATA.organizerRegister },
      { path: 'forgot-password', component: Auth, data: AUTH_ROUTE_DATA.organizerForgotPassword },
      { path: 'verify-email', component: Auth, data: AUTH_ROUTE_DATA.organizerVerifyEmail },
      { path: 'reset-password', component: Auth, data: AUTH_ROUTE_DATA.organizerResetPassword },
    ],
  },

  /** 系統管理員登入 */
  {
    path: 'admin/login',
    component: AdminLogin,
  },

  /** 攤主後台 */
  {
    path: 'vendor/dash-board',
    component: DashboardLayout,
    data: { role: 'vendor' },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: VendorDashboardHome,
      },
      {
        path: 'notification',
        component: VendorDashboardNotification,
      },
      {
        path: 'myStall',
        component: VendorDashboardStall,
      },
      {
        path: 'application-record',
        component: VendorApplicationRecord,
      },
      {
        path: 'appliction-record/detail/:applicationNo',
        component: VendorApplicationDetail,
      },
      {
        path: 'appliction-record/detail',
        component: VendorApplicationDetail,
      },
      {
        path: 'account-settings',
        component: VendorAccountSettings,
      },
      {
        path: 'password-settings',
        component: VendorPasswordSettings,
      },
    ],
  },

  /** 主辦方後台 */
  {
    path: 'organizer/dash-board',
    component: DashboardLayout,
    data: { role: 'organizer' },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: OrganizerDashboardHome,
      },
      {
        path: 'setup-guide',
        component: OrganizerDashboardSetupGuide,
      },
      {
        path: 'notification',
        component: OrganizerDashboardNotification,
      },
      {
        path: 'activity',
        component: OrganizerEventManagement,
      },
    ],
  },

  /** 系統管理員後台 */
  {
    path: 'admin/dash-board',
    component: DashboardLayout,
    data: { role: 'admin' },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: AdminDashboardHome,
      },
      {
        path: 'notification',
        component: AdminDashboardNotification,
      },
      {
        path: 'activity',
        component: AdminDashboardMarketManagemant,
      },
      {
        path: 'activity/detail',
        component: AdminDashboardMarketDetail,
      },
      {
        path: 'users',
        component: AdminDashboardUserManagement,
      },
      {
        path: 'logs',
        component: AdminDashboardLogs,
      },
    ],
  },
];
