import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AddressApiService } from '../../../../core/services/address-api.service';
import { EventSearch } from '../../../../models/interface/shared/EventSearch';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import { MarketRegistrationStatus } from '../../../../models/interface/vendor/VendorMarketSearch';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { Dropdown } from '../../../shared/dropdown/dropdown';

@Component({
  selector: 'app-vendor-market-search-panel',
  imports: [Dropdown, DateRangeSelector],
  templateUrl: './vendor-market-search-panel.html',
  styleUrl: './vendor-market-search-panel.scss',
})
export class VendorMarketSearchPanel implements OnInit {
  /** 送出已轉換成 API 格式的搜尋條件。 */
  @Output() search = new EventEmitter<EventSearch>();

  keyword = '';
  selectedArea = '';
  selectedCity = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';

  cities: string[] = [];
  areas: string[] = [];
  isCityLoading = false;
  cityLoadFailed = false;
  isAreaLoading = false;
  areaLoadFailed = false;
  private districtLoadId = 0;

  /** 可報名活動列表只區分尚有名額與已額滿。 */
  statuses: string[] = ['報名中', '已額滿'];

  get areaOptions(): string[] {
    return ['選擇區域', ...this.areas];
  }

  get cityOptions(): string[] {
    return ['全部縣市', ...this.cities];
  }

  get statusOptions(): string[] {
    return ['全部狀態', ...this.statuses];
  }

  get cityPlaceholder(): string {
    if (this.isCityLoading) return '縣市載入中...';
    if (this.cityLoadFailed) return '縣市載入失敗';
    return '全部縣市';
  }

  get areaPlaceholder(): string {
    if (!this.selectedCity) return '請先選擇縣市';
    if (this.isAreaLoading) return '區域載入中...';
    if (this.areaLoadFailed) return '區域載入失敗';
    return '選擇區域';
  }

  constructor(private readonly addressApiService: AddressApiService) {}

  ngOnInit(): void {
    this.loadCityOptions();
  }

  private loadCityOptions(): void {
    this.isCityLoading = true;
    this.cityLoadFailed = false;

    this.addressApiService.getAddressCities().subscribe({
      next: (response) => {
        this.isCityLoading = false;
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          this.cityLoadFailed = true;
          return;
        }

        this.cities = response.data;
      },
      error: () => {
        this.isCityLoading = false;
        this.cityLoadFailed = true;
      },
    });
  }

  private loadAreaOptions(city: string): void {
    const loadId = ++this.districtLoadId;
    this.areas = [];
    this.selectedArea = '';
    this.areaLoadFailed = false;

    if (!city) {
      this.isAreaLoading = false;
      return;
    }

    this.isAreaLoading = true;
    this.addressApiService.getAddressDistricts(city).subscribe({
      next: (response) => {
        if (loadId !== this.districtLoadId) return;
        this.isAreaLoading = false;
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          this.areaLoadFailed = true;
          return;
        }

        this.areas = response.data;
      },
      error: () => {
        if (loadId !== this.districtLoadId) return;
        this.isAreaLoading = false;
        this.areaLoadFailed = true;
      },
    });
  }

  onKeywordInput(event: Event): void {
    this.keyword = (event.target as HTMLInputElement).value;
  }

  selectArea(area: string): void {
    this.selectedArea = area === '選擇區域' ? '' : area;
  }

  selectCity(city: string): void {
    this.selectedCity = city === '全部縣市' ? '' : city;
    this.loadAreaOptions(this.selectedCity);
  }

  selectStatus(status: string): void {
    this.selectedStatus = status === '全部狀態' ? '' : status;
  }

  onDateRangeChange(range: { startDate: string | null; endDate: string | null }): void {
    this.startDate = range.startDate ?? '';
    this.endDate = range.endDate ?? '';
  }

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
      已額滿: 'FULL',
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

}
