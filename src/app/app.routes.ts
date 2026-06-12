import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/user-layout/user-layout';
import { UserHome } from './modules/user/user-home/user-home';
import { UserActivityList } from './modules/user/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/user-activity-detail/user-activity-detail';
import { VendorLayout } from './modules/vendor/vendor-layout/vendor-layout';
import { UserBrandserch } from './modules/user/user-brandserch/user-brandserch';
import { UserBrandDetail } from './modules/user/user-brand-detail/user-brand-detail';
import { AdminLayout } from './modules/admin/admin-layout/admin-layout';
import { AdminLogin } from './modules/admin/admin-login/admin-login';
import { OrganizerLayout } from './modules/organizer/organizer-layout/organizer-layout';
import { OrganizerHome } from './modules/organizer/organizer-home/organizer-home';
import { Auth } from './modules/auth/auth/auth';
import { UserAboutUs } from './modules/user/user-about-us/user-about-us';
import { AUTH_ROUTE_DATA } from './config/auth-route-data';
import { DashboardLayout } from './modules/dashboard/dashboard-layout/dashboard-layout';
import { VendorDashboardHome } from './modules/vendor/dashboard/vendor-dashboard-home/vendor-dashboard-home';
import { OrganizerDashboardNotification } from './modules/organizer/dashboard/organizer-dashboard-notification/organizer-dashboard-notification';
import { VendorDashboardNotification } from './modules/vendor/dashboard/vendor-dashboard-notification/vendor-dashboard-notification';
import { OrganizerDashboardHome } from './modules/organizer/dashboard/organizer-dashboard-home/organizer-dashboard-home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'user/home',
    pathMatch: 'full',
  },
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
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'login',
        component: AdminLogin,
      },
    ],
  },
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
  {
    path: 'vendor/dash-board',
    component: DashboardLayout,
    data: { role: 'vendor' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: VendorDashboardHome },
      { path: 'notification', component: VendorDashboardNotification },
    ],
  },
  {
    path: 'organizer/dash-board',
    component: DashboardLayout,
    data: { role: 'organizer' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: OrganizerDashboardHome },
      { path: 'notification', component: OrganizerDashboardNotification },
    ],
  },
  {
    path: 'admin/dash-board',
    component: DashboardLayout,
    data: { role: 'admin' },
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];