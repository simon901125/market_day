import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/user-layout/user-layout';
import { UserHome } from './modules/user/user-home/user-home';
import { UserActivityList } from './modules/user/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/user-activity-detail/user-activity-detail';
import { VendorLayout } from './modules/vendor/vendor-layout/vendor-layout';
import { VendorLogin } from './modules/vendor/vendor-login/vendor-login';
import { VendorRegister } from './modules/vendor/vendor-register/vendor-register';
import { VendorVerifyEmail } from './modules/vendor/vendor-verify-email/vendor-verify-email';
import { VendorResetPassword } from './modules/vendor/vendor-reset-password/vendor-reset-password';
import { UserBrandserch } from './modules/user/user-brandserch/user-brandserch';
import { VendorForgotPassword } from './modules/vendor/vendor-forgot-password/vendor-forgot-password';
import { AdminLayout } from './modules/admin/admin-layout/admin-layout';
import { AdminLogin } from './modules/admin/admin-login/admin-login';
import { OrganizerLayout } from './modules/organizer/organizer-layout/organizer-layout';  
import { OrganizerLogin } from './modules/organizer/organizer-login/organizer-login';
import { OrganizerRegister } from './modules/organizer/organizer-register/organizer-register';
import { OrganizerHome } from './modules/organizer/organizer-home/organizer-home';
import { OrganizerActivityShell } from './modules/organizer/organizer-activity-shell/organizer-activity-shell';
import { OrganizerActivityHome } from './modules/organizer/organizer-activity-home/organizer-activity-home';
import { OrganizerActivityNotification } from './modules/organizer/organizer-activity-notification/organizer-activity-notification';

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
      }

    ],
  },
  {
    path: 'vendor',
    component: VendorLayout,
    children: [
      {
        path: 'login',
        component: VendorLogin,
      },
      {
        path: 'register',
        component: VendorRegister,
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
        component: VendorForgotPassword,
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      {
        path: 'login',
        component: AdminLogin,
      }
    ] 
  },
  {
    path: 'organizer',
    component: OrganizerLayout,
    children: [
      {
        path: 'login',
        component: OrganizerLogin,
      },
      {
        path: 'register',
        component: OrganizerRegister,
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
            component: OrganizerActivityHome
          },
          {
            path: 'notification',
            component: OrganizerActivityNotification
          }
        ]
      }
    ]
  }
  
];