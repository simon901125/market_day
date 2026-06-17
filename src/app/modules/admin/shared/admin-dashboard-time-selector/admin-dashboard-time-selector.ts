import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-time-selector',
  imports: [],
  templateUrl: './admin-dashboard-time-selector.html',
  styleUrl: './admin-dashboard-time-selector.scss',
})
export class AdminDashboardTimeSelector {
  /** 顯示於時間選擇器上方的標題文字，預設為空 */
  @Input() selectorTitle: string = '';

  @ViewChild('startInputEl') private startInputElRef!: ElementRef<HTMLInputElement>;
  @ViewChild('endInputEl') private endInputElRef!: ElementRef<HTMLInputElement>;

  /** 使用者選取的開始日期（格式 YYYY-MM-DD），未選取時為 null */
  startDate: string | null = null;

  /** 使用者選取的結束日期（格式 YYYY-MM-DD），未選取時為 null */
  endDate: string | null = null;

  /** 開始日期 input 的 change 事件處理，有值時更新 startDate，清空時設為 null */
  onStartDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.startDate = value || null;
  }

  /** 結束日期 input 的 change 事件處理，有值時更新 endDate，清空時設為 null */
  onEndDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.endDate = value || null;
  }

  /** 回傳目前選取的時間範圍，供父元件透過 ViewChild 呼叫；未輸入的欄位回傳 null */
  getTimeRange(): { startDate: string | null; endDate: string | null } {
    return { startDate: this.startDate, endDate: this.endDate };
  }

  /** 清空已選擇的起訖日期，包含畫面上顯示的日期輸入框 */
  reset(): void {
    this.startDate = null;
    this.endDate = null;
    this.startInputElRef.nativeElement.value = '';
    this.startInputElRef.nativeElement.type = 'text';
    this.endInputElRef.nativeElement.value = '';
    this.endInputElRef.nativeElement.type = 'text';
  }
}
