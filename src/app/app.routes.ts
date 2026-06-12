import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/frontend/user-layout/user-layout';
import { UserHome } from './modules/user/frontend/user-home/user-home';
import { UserActivityList } from './modules/user/frontend/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/frontend/user-activity-detail/user-activity-detail';
import { VendorLayout } from './modules/vendor/vendor-layout/vendor-layout';
import { UserBrandserch } from './modules/user/frontend/user-brandserch/user-brandserch';
import { UserBrandDetail } from './modules/user/frontend/user-brand-detail/user-brand-detail';
import { AdminLogin } from './modules/admin/admin-login/admin-login';
import { OrganizerLayout } from './modules/organizer/organizer-layout/organizer-layout';
import { OrganizerHome } from './modules/organizer/frontend/organizer-home/organizer-home';
import { Auth } from './modules/auth/auth/auth';
import { UserAboutUs } from './modules/user/frontend/user-about-us/user-about-us';
import { AUTH_ROUTE_DATA } from './config/auth-route-data';
import { DashboardLayout } from './modules/dashboard/dashboard-layout/dashboard-layout';
import { VendorDashboardHome } from './modules/vendor/dashboard/vendor-dashboard-home/vendor-dashboard-home';
import { VendorDashboardNotification } from './modules/vendor/dashboard/vendor-dashboard-notification/vendor-dashboard-notification';
import { OrganizerDashboardHome } from './modules/organizer/dashboard/organizer-dashboard-home/organizer-dashboard-home';
import { OrganizerDashboardNotification } from './modules/organizer/dashboard/organizer-dashboard-notification/organizer-dashboard-notification';

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
    component: VendorLayout,
    children: [
      {
        path: 'login',
        component: Auth,
        data: AUTH_ROUTE_DATA.vendorLogin,
      },
      {
        path: 'register',
        component: Auth,
        data: AUTH_ROUTE_DATA.vendorRegister,
      },
      {
        path: 'verify-email',
        component: Auth,
        data: AUTH_ROUTE_DATA.vendorVerifyEmail,
      },
      {
        path: 'forgot-password',
        component: Auth,
        data: AUTH_ROUTE_DATA.vendorForgotPassword,
      },
      {
        path: 'reset-password',
        component: Auth,
        data: AUTH_ROUTE_DATA.vendorResetPassword,
      },
    ],
  },

  /** 主辦方專區 / 登入 / 註冊 / 驗證 */
  {
    path: 'organizer',
    component: OrganizerLayout,
    children: [
      {
        path: 'login',
        component: Auth,
        data: AUTH_ROUTE_DATA.organizerLogin,
      },
      {
        path: 'register',
        component: Auth,
        data: AUTH_ROUTE_DATA.organizerRegister,
      },
      {
        path: 'forgot-password',
        component: Auth,
        data: AUTH_ROUTE_DATA.organizerForgotPassword,
      },
      {
        path: 'reset-password',
        component: Auth,
        data: AUTH_ROUTE_DATA.organizerResetPassword,
      },
      {
        path: 'verify-email',
        component: Auth,
        data: AUTH_ROUTE_DATA.organizerVerifyEmail,
      },
      {
        path: 'home',
        component: OrganizerHome,
      },
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