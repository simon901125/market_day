import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../../models/MenuItem';
import { UserMenuItem } from '../../../models/UserMenuItem';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
  /** 後台 Logo */
  @Input() logoPath = '';

  /** 側邊欄目錄 */
  @Input() menuItems: MenuItem[] = [];

  /** 使用者選單 */
  @Input() userMenuItems: UserMenuItem[] = [];

  /** 使用者名稱 */
  @Input() userName = '';

  /** 使用者郵件 */
  @Input() userEmail = '';

  /** 使用者姓氏 */
  @Input() userInitial = '';

  /** 是否開啟使用者選單 */
  isUserMenuOpen = false;

  /** 切換使用者選單 */
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /** 點擊登出 */
  logout(): void {
    console.log('logout');
  }
}