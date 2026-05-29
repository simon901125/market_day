import { Routes } from '@angular/router';
import { UserLayout } from './modules/user/user-layout/user-layout';
import { UserHome } from './modules/user/user-home/user-home';
import { UserActivityList } from './modules/user/user-activity-list/user-activity-list';
import { UserActivityDetail } from './modules/user/user-activity-detail/user-activity-detail';

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
];