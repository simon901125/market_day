import { Component, ElementRef, Input, ViewChild } from '@angular/core';

/** 共用日期區間選擇器 */
@Component({
  selector: 'app-date-range-selector',
  imports: [],
  templateUrl: './date-range-selector.html',
  styleUrl: './date-range-selector.scss',
})
export class DateRangeSelector {
  /** 區間選擇器標題 */
  @Input() title = '';
  /** 相容舊後台日期元件使用的標題 input */
  @Input() selectorTitle = '';

  @ViewChild('startInputEl') private startInputElRef!: ElementRef<HTMLInputElement>;
  @ViewChild('endInputEl') private endInputElRef!: ElementRef<HTMLInputElement>;

  /** 起始日期，格式為 YYYY-MM-DD */
  @Input() startDate: string | null = null;
  /** 結束日期，格式為 YYYY-MM-DD */
  @Input() endDate: string | null = null;

  /** 顯示用標題 */
  get displayTitle(): string {
    return this.title || this.selectorTitle;
  }

  /** 更新起始日期 */
  onStartDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.startDate = value || null;
  }

  /** 更新結束日期 */
  onEndDateChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.endDate = value || null;
  }

  /** 聚焦時切換為日期選擇器 */
  showDatePicker(event: FocusEvent): void {
    (event.target as HTMLInputElement).type = 'date';
  }

  /** 未選日期時回到文字 placeholder */
  restorePlaceholder(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;

    if (!input.value) {
      input.type = 'text';
    }
  }

  /** 取得目前選取的日期區間 */
  getTimeRange(): { startDate: string | null; endDate: string | null } {
    return { startDate: this.startDate, endDate: this.endDate };
  }

  /** 清空日期區間 */
  reset(): void {
    this.startDate = null;
    this.endDate = null;
    this.startInputElRef.nativeElement.value = '';
    this.startInputElRef.nativeElement.type = 'text';
    this.endInputElRef.nativeElement.value = '';
    this.endInputElRef.nativeElement.type = 'text';
  }
}
