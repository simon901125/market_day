import { Component, OnInit } from '@angular/core';
import { VendorHeader } from '../vendor-header/vendor-header';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorMarketCard } from '../vendor-market-card/vendor-market-card';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import {
  VendorMarketSearchCriteria,
  VendorMarketSearchPanel,
} from '../vendor-market-search-panel/vendor-market-search-panel';
import { Router } from '@angular/router';
import { Pagination } from '../../../shared/pagination/pagination';
import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { EventSearch } from '../../../../models/interface/shared/EventSearch';
@Component({
  selector: 'app-vendor-market-signup-list',
  imports: [VendorHeader, UserFooter, VendorMarketCard, VendorMarketSearchPanel, Pagination],
  templateUrl: './vendor-market-signup-list.html',
  styleUrl: './vendor-market-signup-list.scss',
})
export class VendorMarketSignupList implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly vendorService: VendorService
  ) {}
  keyword = '';
  selectedCity = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 6;
  totalItems = 0;
  isLoading = false;
  loadError = '';
  private searchCriteria: EventSearch = {};
  markets: MarketCardItem[] = [];

  ngOnInit(): void {
    this.loadMarkets();
  }

  get filteredMarkets(): MarketCardItem[] {
    return this.markets;
  }

  //page應該會傳到後端做計算
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
  get pagedMarkets(): MarketCardItem[] {
    return this.markets;
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadMarkets();
  }

  prevPage(): void {
    this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  resetPage(): void {
    this.currentPage = 1;
  }


  //地區抓不到
  onSearch(criteria: EventSearch): void {
    this.searchCriteria = {
      keyword: criteria.keyword,
      city: criteria.city,
      district: criteria.district,
      status: criteria.status,
      eventStartAt: criteria.eventStartAt,
      eventEndAt: criteria.eventEndAt,
    };
    this.currentPage = 1;
    this.loadMarkets();
  }

  /**
   * 抓所有活動
   */
  private loadMarkets(): void {
    this.isLoading = true;
    this.loadError = '';

    this.vendorService
      .searchMarkets({
        ...this.searchCriteria,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (response) => {
          const result = this.readSearchResult(response.data);
          this.markets = result.items.map((item) => this.toMarketCard(item));
          this.totalItems = result.totalItems;
          this.isLoading = false;
        },
        error: () => {
          this.markets = [];
          this.totalItems = 0;
          this.loadError = '活動列表載入失敗，請稍後再試。';
          this.isLoading = false;
        },
      });
  }

  private readSearchResult(data: unknown): {
    items: MarketSearchItem[];
    totalItems: number;
  } {
    const response = data as Partial<MarketSearchResponse> | null;
    const marketPage = response?.markets;

    return {
      items: marketPage?.items ?? [],
      totalItems: marketPage?.totalItems ?? 0,
    };
  }

  private toMarketCard(item: MarketSearchItem): MarketCardItem {
    const startAt = new Date(item.startAt);
    const endAt = new Date(item.endAt);
    const status = this.toMarketStatus(item.registrationStatus);

    return {
      id: String(item.eventId),
      title: item.eventTitle,
      time: `${this.formatTime(startAt)} - ${this.formatTime(endAt)}`,
      start_date: this.formatDate(startAt),
      end_date: this.formatDate(endAt),
      description: item.summary,
      location: item.locationName,
      address: item.address,
      city: item.city,
      area: item.district,
      image: item.imageUrl || 'assets/images/market/cards/market-card-01.png',
      status,
      statusClass: MarketStatus.getClass(status),
      tags: item.categoryName ? [item.categoryName] : [],
      category: item.categoryName ?? '',
      organizer: item.organizerName ?? '',
      transportation: [item.trafficTitle, item.trafficDetail].filter(
        (value): value is string => Boolean(value),
      ),
      price: item.baseFee,
      maxBooths: item.maxBooths,
      registrationStartAt: item.registrationStartAt ?? undefined,
      registrationEndAt: item.registrationEndAt ?? undefined,
      trafficTitle: item.trafficTitle ?? '',
      trafficDetail: item.trafficDetail ?? '',
      slots: [],
    };
  }

  private toMarketStatus(status: MarketRegistrationStatus): string {
    const statusMap: Record<MarketRegistrationStatus, string> = {
      OPEN: MarketStatus.active,
      UPCOMING: MarketStatus.preview,
      CLOSED: MarketStatus.ended,
    };
    return statusMap[status] ?? status;
  }

  private formatDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  private formatTime(value: Date): string {
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private parseDate(value: string): Date | undefined {
    if (!value) return undefined;
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  /**
   * 導航到市集報名詳情頁
   * @param market 選擇的市集
   */
  goToSignUpDetail(market: MarketCardItem): void {
    this.router.navigate(['/vendor/sign-up-detail'], {
      state: { market },
    });

    console.log(market);
  }
}

// intereface不該在這裡
interface MarketSearchResponse {
  markets: MarketSearchPage;
}

interface MarketSearchPage {
  items: MarketSearchItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface MarketSearchItem {
  eventId: number;
  eventTitle: string;
  summary: string;
  locationName: string;
  city: string;
  district: string;
  address: string;
  maxBooths: number;
  startAt: string;
  endAt: string;
  registrationStartAt: string | null;
  registrationEndAt: string | null;
  baseFee: number;
  trafficTitle: string | null;
  trafficDetail: string | null;
  categoryName: string | null;
  organizerName: string | null;
  imageUrl: string | null;
  registrationStatus: MarketRegistrationStatus;
}

type MarketRegistrationStatus = 'OPEN' | 'UPCOMING' | 'CLOSED';
