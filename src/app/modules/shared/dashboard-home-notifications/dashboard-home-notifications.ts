import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface NotificationItem {
  icon: string;
  iconColor: string;
  tag: string;
  content: string;
  time: string;
}

@Component({
  selector: 'app-dashboard-home-notifications',
  imports: [RouterLink],
  templateUrl: './dashboard-home-notifications.html',
  styleUrl: './dashboard-home-notifications.scss',
})
export class DashboardHomeNotifications {
  @Input() notifications: NotificationItem[] = [];
  @Input() viewAllLink = '/admin/dash-board/notification';
}
