import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-home-todo-card',
  imports: [RouterLink],
  templateUrl: './dashboard-home-todo-card.html',
  styleUrl: './dashboard-home-todo-card.scss',
})
export class DashboardHomeTodoCard {
  /** Bootstrap icon class，例如 'bi-person-check' */
  @Input() icon = '';

  /** 顯示的數字 */
  @Input() count = 0;

  /** 數字單位，例如 '筆' */
  @Input() unit = '';

  /** 卡片標題文字 */
  @Input() label = '';

  /** 連結路徑，有值才顯示「前往查看」按鈕 */
  @Input() path?: string;

  /** icon 圓形背景色，預設使用主題色背景 */
  @Input() iconBgColor = 'var(--bg-primary)';

  /** icon 本身的顏色，預設使用主題主色 */
  @Input() iconColor = 'var(--primary-color)';
}
