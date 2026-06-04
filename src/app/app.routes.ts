import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/user-layout/user-layout';
import { UserHome } from './modules/user/user-home/user-home';
import { UserActivityList } from './modules/user/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/user-activity-detail/user-activity-detail';
import { VendorLayout } from './modules/vendor/vendor-layout/vendor-layout';
import { VendorVerifyEmail } from './modules/vendor/vendor-verify-email/vendor-verify-email';
import { VendorResetPassword } from './modules/vendor/vendor-reset-password/vendor-reset-password';
import { UserBrandserch } from './modules/user/user-brandserch/user-brandserch';
import { UserBrandDetail } from './modules/user/user-brand-detail/user-brand-detail';
import { AdminLayout } from './modules/admin/admin-layout/admin-layout';
import { AdminLogin } from './modules/admin/admin-login/admin-login';
import { OrganizerLayout } from './modules/organizer/organizer-layout/organizer-layout';
import { OrganizerHome } from './modules/organizer/organizer-home/organizer-home';
import { OrganizerActivityShell } from './modules/organizer/organizer-activity-shell/organizer-activity-shell';
import { OrganizerActivityHome } from './modules/organizer/organizer-activity-home/organizer-activity-home';
import { OrganizerActivityNotification } from './modules/organizer/organizer-activity-notification/organizer-activity-notification';
import { Auth } from './modules/auth/auth/auth';

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
    ],
  },
  {
    path: 'vendor',
    component: VendorLayout,
    children: [
      {
        path: 'login',
        component: Auth,
        data: {
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
      },
      {
        path: 'register',
        component: Auth,
        data: {
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
      },
      {
        path: 'verify-email',
        component: VendorVerifyEmail,
      },
      {
        path: 'reset-password',
        component: VendorResetPassword,
      },
      {
        path: 'forgot-password',
        component: Auth,
        data: {
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
        },
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
        data: {
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
      },
      {
        path: 'register',
        component: Auth,
        data: {
          role: 'organizer',
          mode: 'register',
          sidebarComponent: 'organizer',
          title: '加入小集日，\n開啟你的',
          highlight: '主辦方後台',
          description: '登入你的主辦方帳號，\n管理你的市集與活動。',
          topText: '已經有主辦方帳號了？',
          topLinkText: '前往登入',
          topLink: '/organizer/login',
          systemName: '主辦方後台',
          formTitle: '主辦方註冊',
          logoImg: '/assets/images/logo/logo-market-day-organizer.png',
        },
      },
      {
        path: 'forgot-password',
        component: Auth,
        data: {
          role: 'vendor',
          mode: 'forgot',
          title: '忘記密碼了嗎？',
          highlight: '',
          description: '輸入註冊 Email，\n我們會寄送重設密碼驗證碼至你的信箱。',
          topText: '想起密碼了？',
          topLinkText: '返回登入',
          topLink: '/organizer/login',
          formTitle: '忘記密碼',
          logoImg: '/assets/images/logo/logo-market-day-organizer.png',
          
        },
      },
      {
        path: 'home',
        component: OrganizerHome,
      },
      {
        path: 'activity',
        component: OrganizerActivityShell,
        children: [
          {
            path: 'home',
            component: OrganizerActivityHome,
          },
          {
            path: 'notification',
            component: OrganizerActivityNotification,
          },
        ],
      },
    ],
  },
];
