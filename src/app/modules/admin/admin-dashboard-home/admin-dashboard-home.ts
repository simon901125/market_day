import { Component } from '@angular/core';
import { DashboardHomeTodoCard } from '../../dashboard/dashboard-home-todo-card/dashboard-home-todo-card';
import { DashboardNotification } from '../../dashboard/dashboard-notification/dashboard-notification';
import { AdminDashboardNotification } from '../admin-dashboard-notification/admin-dashboard-notification';

interface TodoItem {
  icon: string;
  count: number;
  unit: string;
  label: string;
  path: string;
  iconColor?: string;
}

interface StatItem {
  icon: string;
  value: number;
  unit: string;
  label: string;
  iconColor?: string;
}

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [DashboardHomeTodoCard, DashboardNotification],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.scss',
})
export class AdminDashboardHome extends AdminDashboardNotification {
  todoItems: TodoItem[] = [
    {
      icon: 'bi-person-badge',
      count: 5,
      unit: '筆',
      label: '待審核主辦方',
      path: '/admin/dash-board/users',
      iconColor: 'orange',
    },
    {
      icon: 'bi-wallet2',
      count: 2,
      unit: '筆',
      label: '待補件確認',
      path: '/admin/dash-board/users',
      iconColor: 'orange',
    },
    {
      icon: 'bi-exclamation-triangle',
      count: 1,
      unit: '筆',
      label: '異常提醒',
      path: '/admin/dash-board/logs',
      iconColor: 'red',
    },
  ];

  platformStats: StatItem[] = [
    { icon: 'bi-people', value: 32, unit: '位', label: '主辦方總數', iconColor: 'teal' },
    { icon: 'bi-shop', value: 126, unit: '位', label: '攤主總數', iconColor: 'blue' },
    { icon: 'bi-calendar-check', value: 18, unit: '場', label: '活動總數', iconColor: 'purple' },
    { icon: 'bi-flag', value: 7, unit: '場', label: '進行中活動', iconColor: 'green' },
  ];
}
