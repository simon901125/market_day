import { Component } from '@angular/core';
import { OrganizerDashboardNotification } from '../organizer-dashboard-notification/organizer-dashboard-notification';
import { DashboardHomeTodoCard } from '../../../shared/dashboard/dashboard-home-todo-card/dashboard-home-todo-card';
import { DashboardNotification } from '../../../shared/dashboard/dashboard-notification/dashboard-notification';
import { TodoItem } from '../../../../models/interface/organizer/OrganizerDashboardHomeTodo';

@Component({
  selector: 'app-organizer-dashboard-home',
  imports: [DashboardHomeTodoCard, DashboardNotification],
  templateUrl: './organizer-dashboard-home.html',
  styleUrl: './organizer-dashboard-home.scss',
})
export class OrganizerDashboardHome extends OrganizerDashboardNotification {
  todoItems: TodoItem[] = [
    {
      icon: 'bi-clipboard-heart',
      count: 12,
      unit: '筆',
      label: '待審核報名',
      path: '/organizer/dash-board/register',
      iconColor: 'orange',
    },
    {
      icon: 'bi-wallet2',
      count: 3,
      unit: '筆',
      label: '退款申請中',
      path: '/organizer/dash-board/collection',
      iconColor: 'red',
    },
    {
      icon: 'bi-calendar3',
      count: 2,
      unit: '場',
      label: '即將開始活動',
      path: '/organizer/dash-board/activity',
      iconColor: 'blue',
    },
  ];
}
