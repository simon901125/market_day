import { Component, Input } from '@angular/core';

/** 允許的按鈕類型 */
type ButtonType = 'search' | 'clear' | 'primary' | 'secondary';

@Component({
  selector: 'app-admin-dashboard-button',
  imports: [],
  templateUrl: './admin-dashboard-button.html',
  styleUrl: './admin-dashboard-button.scss',
})
export class AdminDashboardButton {
  /** 按鈕外觀類型：'search' 搜尋 | 'clear' 清除條件 | 'primary' 主要操作 | 'secondary' 次要操作 */
  @Input() type: ButtonType = 'primary';

  /** 點擊按鈕後執行的動作，由父元素傳入 */
  @Input() todo: () => void = () => {};

  /** 按鈕顯示文字，適用於 primary / secondary 類型；search / clear 類型忽略此值 */
  @Input() text?: string;
}
