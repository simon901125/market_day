import { Component, Input } from '@angular/core';
import { MenuItem } from '../../../models/MenuItem';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-dashboard-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './dashboard-sidebar.html',
  styleUrl: './dashboard-sidebar.scss',
})
export class DashboardSidebar {
  /** 後台標題 */
  @Input() backendTitle = '';
  /** 側邊欄目錄 */
  @Input() menuItems: MenuItem[] = [];
  /** 使用者名稱 */
  @Input() userName = '';
  /** 使用者郵件 */
  @Input() userEmail = '';
  /** 使用者 姓 */
  @Input() userInitial = '';
}
