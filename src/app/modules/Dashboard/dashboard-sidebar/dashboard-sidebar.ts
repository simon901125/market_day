import { Component, Input } from '@angular/core';
import { MenuItem } from '../../../models/MenuItem';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
 /** 後台 Logo */
  @Input() logoPath = '';

  /** 側邊欄目錄 */
  @Input() menuItems: MenuItem[] = [];

  /** 使用者名稱 */
  @Input() userName = '';

  /** 使用者郵件 */
  @Input() userEmail = '';

  /** 使用者姓氏 */
  @Input() userInitial = '';
}
