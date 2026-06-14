import { Component } from '@angular/core';
import { DashboardHomeTodoCard } from '../../shared/dashboard-home-todo-card/dashboard-home-todo-card';
import { DashboardHomeNotifications, NotificationItem } from '../../shared/dashboard-home-notifications/dashboard-home-notifications';

interface TodoItem {
  icon: string;
  count: number;
  unit: string;
  label: string;
  path: string;
  iconBgColor?: string;
  iconColor?: string;
}

interface StatItem {
  icon: string;
  value: number;
  unit: string;
  label: string;
  iconBgColor?: string;
  iconColor?: string;
}

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [DashboardHomeTodoCard, DashboardHomeNotifications],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.scss',
})
export class AdminDashboardHome {
  /** 待辦事項假資料 */
  todoItems: TodoItem[] = [
    {
      icon: 'bi-exclamation-triangle',
      count: 1, //接api傳進來的資料
      unit: '筆',
      label: '異常提醒',
      path: '/admin/dash-board/logs',
      iconBgColor: '#fbe9ec',
      iconColor: '#e96379',
    },
    {
      icon: 'bi-person-check',
      count: 5, //接api傳進來的資料
      unit: '筆',
      label: '待審核主辦方',
      path: '/admin/dash-board/organizer',
    },
    {
      icon: 'bi-file-earmark-check',
      count: 2, //接api傳進來的資料
      unit: '筆',
      label: '補件確認',
      path: '/admin/dash-board/organizer',
    },
  ];

  /** 平台概況假資料 */
  platformStats: StatItem[] = [
    { icon: 'bi-flag', value: 7, unit: '場', label: '進行中活動', iconBgColor: '#e9fbf0', iconColor: '#40bf71', },
    { icon: 'bi-people', value: 32, unit: '位', label: '主辦方總數' },
    { icon: 'bi-shop', value: 126, unit: '位', label: '攤主總數' },
    { icon: 'bi-calendar3', value: 18, unit: '場', label: '活動總數' },
  ];

  /** 最新通知假資料 */
  recentNotifications: NotificationItem[] = [
    {
      icon: 'bi-person-plus',
      iconColor: 'blue',
      tag: '[新申請]',
      content: '主辦方「森林生活市集」申請加入平台',
      time: '2026/06/02 14:30',
      unread: true,
    },
    {
      icon: 'bi-file-earmark-arrow-up',
      iconColor: 'yellow',
      tag: '[補件完成]',
      content: '主辦方「日日好市」已重新送出資料',
      time: '2026/06/02 13:10',
      unread: true,
    },
    {
      icon: 'bi-calendar-plus',
      iconColor: 'teal',
      tag: '[新活動]',
      content: '主辦方建立活動：夏日綠意市集',
      time: '2026/06/02 11:45',
      unread: true,
    },
    {
      icon: 'bi-exclamation-triangle',
      iconColor: 'red',
      tag: '[異常紀錄]',
      content: '帳號「user_***@gmail.com」登入異常次數偏高',
      time: '2026/06/02 10:15',
      unread: false,
    },
    {
      icon: 'bi-megaphone',
      iconColor: 'purple',
      tag: '[系統公告]',
      content: '系統將於 06/10 (二) 00:00 ~ 02:00 進行維護',
      time: '2026/06/01 16:20',
      unread: false,
    },
  ];
}
