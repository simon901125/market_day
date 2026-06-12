import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/frontend/user-layout/user-layout';
import { UserHome } from './modules/user/frontend/user-home/user-home';
import { UserActivityList } from './modules/user/frontend/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/frontend/user-activity-detail/user-activity-detail';
import { UserBrandserch } from './modules/user/frontend/user-brandserch/user-brandserch';
import { UserBrandDetail } from './modules/user/frontend/user-brand-detail/user-brand-detail';
import { AdminLogin } from './modules/admin/admin-login/admin-login';
import { Auth } from './modules/auth/auth/auth';
import { UserAboutUs } from './modules/user/frontend/user-about-us/user-about-us';
import { AUTH_ROUTE_DATA } from './config/auth-route-data';
import { DashboardLayout } from './modules/dashboard/dashboard-layout/dashboard-layout';
import { VendorDashboardHome } from './modules/vendor/dashboard/vendor-dashboard-home/vendor-dashboard-home';
import { VendorDashboardNotification } from './modules/vendor/dashboard/vendor-dashboard-notification/vendor-dashboard-notification';
import { OrganizerDashboardHome } from './modules/organizer/dashboard/organizer-dashboard-home/organizer-dashboard-home';
import { OrganizerDashboardNotification } from './modules/organizer/dashboard/organizer-dashboard-notification/organizer-dashboard-notification';
import { OrganizerHome } from './modules/organizer/frontend/organizer-home/organizer-home';
import { VendorHome } from './modules/vendor/frontend/vendor-home/vendor-home';

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
        path: 'brands',
        component: UserBrandserch,
      },
      {
        path: 'activity-list',
        component: UserActivityList,
      },
      {
        path: 'activity-detail',
        component: UserActivityDetail,
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
        path: 'notification',
        component: OrganizerDashboardNotification,
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
    ],
  },
];