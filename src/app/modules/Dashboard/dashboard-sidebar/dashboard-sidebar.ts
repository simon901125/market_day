import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-dashboard-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
  /** Logo 圖片路徑 */
  @Input() logoPath = '';

  /** Logo 點擊後導向的首頁路徑 */
  @Input() homePath = '/';

  /** 側邊欄選單 */
  @Input() menuItems: any[] = [];

  /** 使用者功能選單 */
  @Input() userMenuItems: any[] = [];

  /** 使用者頭像文字 */
  @Input() userInitial = '';

  /** 使用者名稱 */
  @Input() userName = '';

  /** 使用者 Email */
  @Input() userEmail = '';

  /** 使用者選單是否展開 */
  isUserMenuOpen = false;

  /** 切換使用者選單 */
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  /** 登出 */
  logout(): void {
    console.log('logout');
  }

  /** 點擊頁面其他區域時關閉使用者選單 */
  @HostListener('document:click')
  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }
}