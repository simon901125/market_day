import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventSearch } from '../../../../models/interface/shared/EventSearch';
import { MarketRegistrationStatus } from '../../../../models/interface/vendor/VendorMarketSearch';
@Component({
  selector: 'app-vendor-market-search-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-market-search-panel.html',
  styleUrl: './vendor-market-search-panel.scss',
})
export class VendorMarketSearchPanel {
  /** 送出已轉換成 API 格式的搜尋條件。 */
  @Output() search = new EventEmitter<EventSearch>();

  keyword = '';
  selectedArea = '';
  selectedCity = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';

  areas: string[] = ['北部', '中部', '南部', '東部', '離島'];

  cities: string[] = [
    '台北市',
    '新北市',
    '桃園市',
    '新竹市',
    '台中市',
    '台南市',
    '高雄市',
    '宜蘭縣',
  ];

  /** 後端目前支援的三種報名狀態。 */
  statuses: string[] = ['報名中', '即將開放', '已截止'];

  /** 將畫面欄位轉成列表與 API 共用的 EventSearch。 */
  submitSearch(): void {
    this.search.emit({
      keyword: this.emptyToUndefined(this.keyword),
      city: this.emptyToUndefined(this.selectedCity),
      district: this.emptyToUndefined(this.selectedArea),
      status: this.toApiStatus(this.selectedStatus),
      eventStartAt: this.parseDate(this.startDate),
      eventEndAt: this.parseDate(this.endDate),
    });
  }

  private toApiStatus(status: string): MarketRegistrationStatus | undefined {
    const statusMap: Record<string, MarketRegistrationStatus> = {
      報名中: 'OPEN',
      即將開放: 'UPCOMING',
      已截止: 'CLOSED',
    };
    return statusMap[status];
  }

  private emptyToUndefined(value: string): string | undefined {
    const normalizedValue = value.trim();
    return normalizedValue || undefined;
  }

  /** 將 YYYY-MM-DD 轉成本地日期，避免 UTC 時差改變查詢日期。 */
  private parseDate(value: string): Date | undefined {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return undefined;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  @HostListener('click', ['$event'])
  onPanelClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('.search-btn')) {
      this.submitSearch();
    }
  }
}
