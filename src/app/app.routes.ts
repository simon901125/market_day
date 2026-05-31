import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/user-layout/user-layout';
import { UserHome } from './modules/user/user-home/user-home';
import { UserActivityList } from './modules/user/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/user-activity-detail/user-activity-detail';
import { VendorLayout } from './modules/vendor/vendor-layout/vendor-layout';
import { VendorLogin } from './modules/vendor/vendor-login/vendor-login';
import { VendorRegister } from './modules/vendor/vendor-register/vendor-register';
import { VendorVerifyEmail } from './modules/vendor/vendor-verify-email/vendor-verify-email';

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
      }
    ]
  }
];