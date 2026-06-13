import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardHomeTodoCard } from '../../shared/dashboard-home-todo-card/dashboard-home-todo-card';

interface TodoItem {
  icon: string;
  count: number;
  unit: string;
  label: string;
  path: string;
}

interface StatItem {
  icon: string;
  value: number;
  unit: string;
  label: string;
}

interface NotificationItem {
  icon: string;
  iconColor: string;
  tag: string;
  content: string;
  time: string;
}

@Component({
  selector: 'app-admin-dashboard-home',
  imports: [RouterLink, DashboardHomeTodoCard],
  templateUrl: './admin-dashboard-home.html',
  styleUrl: './admin-dashboard-home.scss',
})
export class AdminDashboardHome {
  /** 待辦事項假資料 */
  todoItems: TodoItem[] = [
    {
      icon: 'bi-person-check',
      count: 5,
      unit: '筆',
      label: '待審核主辦方',
      path: '/admin/dash-board/organizer',
    },
    {
      icon: 'bi-file-earmark-check',
      count: 2,
      unit: '筆',
      label: '補件確認',
      path: '/admin/dash-board/organizer',
    },
    {
      icon: 'bi-exclamation-triangle',
      count: 1,
      unit: '筆',
      label: '異常提醒',
      path: '/admin/dash-board/logs',
    },
  ];

  /** 平台概況假資料 */
  platformStats: StatItem[] = [
    { icon: 'bi-building', value: 32, unit: '位', label: '主辦方總數' },
    { icon: 'bi-shop', value: 126, unit: '位', label: '攤主總數' },
    { icon: 'bi-calendar3', value: 18, unit: '場', label: '活動總數' },
    { icon: 'bi-flag', value: 7, unit: '場', label: '進行中活動' },
  ];

  /** 最新通知假資料 */
  recentNotifications: NotificationItem[] = [
    {
      icon: 'bi-person-plus',
      iconColor: 'icon-apply',
      tag: '[新申請]',
      content: '主辦方「森林生活市集」申請加入平台',
      time: '2026/06/02 14:30',
    },
    {
      icon: 'bi-file-earmark-arrow-up',
      iconColor: 'icon-supplement',
      tag: '[補件完成]',
      content: '主辦方「日日好市」已重新送出資料',
      time: '2026/06/02 13:10',
    },
    {
      icon: 'bi-calendar-plus',
      iconColor: 'icon-activity',
      tag: '[新活動]',
      content: '主辦方建立活動：夏日綠意市集',
      time: '2026/06/02 11:45',
    },
    {
      icon: 'bi-exclamation-triangle',
      iconColor: 'icon-warning',
      tag: '[異常紀錄]',
      content: '帳號「user_***@gmail.com」登入異常次數偏高',
      time: '2026/06/02 10:15',
    },
    {
      icon: 'bi-megaphone',
      iconColor: 'icon-system',
      tag: '[系統公告]',
      content: '系統將於 06/10 (二) 00:00 ~ 02:00 進行維護',
      time: '2026/06/01 16:20',
    },
  ];
}
