import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-date-range-selector',
  imports: [],
  templateUrl: './date-range-selector.html',
  styleUrl: './date-range-selector.scss',
})
export class DateRangeSelector {
  @Input() title = '';
  @Input() selectorTitle = '';
  @Input() startDate: string | null = null;
  @Input() endDate: string | null = null;

  @Output() dateRangeChange = new EventEmitter<{ startDate: string | null; endDate: string | null }>();

  @ViewChild('startInputEl') private startInputElRef!: ElementRef<HTMLInputElement>;
  @ViewChild('endInputEl') private endInputElRef!: ElementRef<HTMLInputElement>;

  get displayTitle(): string {
    return this.title || this.selectorTitle;
  }

  onStartDateChange(event: Event): void {
    this.startDate = (event.target as HTMLInputElement).value || null;
    this.emitDateRangeChange();
  }

  onEndDateChange(event: Event): void {
    this.endDate = (event.target as HTMLInputElement).value || null;
    this.emitDateRangeChange();
  }

  showDatePicker(event: FocusEvent): void {
    (event.target as HTMLInputElement).type = 'date';
  }

  restorePlaceholder(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;

    if (!input.value) {
      input.type = 'text';
    }
  }

  getTimeRange(): { startDate: string | null; endDate: string | null } {
    return { startDate: this.startDate, endDate: this.endDate };
  }

  reset(): void {
    this.startDate = null;
    this.endDate = null;
    this.startInputElRef.nativeElement.value = '';
    this.startInputElRef.nativeElement.type = 'text';
    this.endInputElRef.nativeElement.value = '';
    this.endInputElRef.nativeElement.type = 'text';
    this.emitDateRangeChange();
  }

  private emitDateRangeChange(): void {
    this.dateRangeChange.emit(this.getTimeRange());
  }
}
