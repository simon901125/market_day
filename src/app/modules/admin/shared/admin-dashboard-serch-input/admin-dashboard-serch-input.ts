import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-serch-input',
  imports: [],
  templateUrl: './admin-dashboard-serch-input.html',
  styleUrl: './admin-dashboard-serch-input.scss',
})
export class AdminDashboardSerchInput {
  /** 尚未輸入時顯示的提示文字 */
  @Input() placeholder: string = '';

  /**標籤名稱，預設為空 */
  @Input() searchTitle: string = '';

  /** 觸發搜尋時輸出目前的輸入值（按 Enter 或父元素呼叫 triggerSearch()） */
  @Output() search = new EventEmitter<string>();

  inputValue: string = '';

  onInput(event: Event) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  onEnter() {
    this.search.emit(this.inputValue);
  }

  /** 供父元素透過 ViewChild 主動觸發，取得目前輸入值 */
  triggerSearch() {
    this.search.emit(this.inputValue);
  }
}
