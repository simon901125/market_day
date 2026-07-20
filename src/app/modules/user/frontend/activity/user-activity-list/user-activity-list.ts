import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertService } from '../../../../../core/services/alert.service';
import { MarketCardItem } from '../../../../../models/interface/shared/MarketCardItem';
import { HistoryMarketCardItem } from '../../../../../models/interface/user/HistoryMarketCardItem';
import { UserMarketCardApi } from '../../../../../models/interface/user/UserPublicApi';
import { MarketStatus } from '../../../../../models/status/MarketStatus';
import { Pagination } from '../../../../shared/pagination/pagination';
import { UserMarketApiService } from '../../../services/user-market-api.service';
import { UserHistoryMarketCard } from '../../shared/user-history-market-card/user-history-market-card';
import { UserMarketCard } from '../../shared/user-market-card/user-market-card';
import {
  UserMarketSearchPanel,
  UserMarketSearchParams as UserMarketPanelSearchParams,
} from '../../shared/user-market-search-panel/user-market-search-panel';

const formatApiDate = (value: string | null | undefined): string =>
  value ? value.replace(/-/g, '/') : '';

const categoryNames = (market: UserMarketCardApi): string[] =>
  (market.categories ?? []).map((category) => category.name).filter(Boolean);

const mapMarketCard = (market: UserMarketCardApi): MarketCardItem => {
  const status = market.eventStatus || MarketStatus.upcoming;

  return {
    id: String(market.id),
    title: market.title,
    start_date: formatApiDate(market.startDate),
    end_date: formatApiDate(market.endDate),
    description: market.summary ?? '',
    time: '',
    location: [market.city, market.district, market.locationName].filter(Boolean).join(' '),
    address: market.address ?? '',
    city: market.city ?? '',
    area: market.district ?? '',
    category: categoryNames(market)[0] ?? '',
    image: market.coverImageUrl ?? 'assets/images/market/cards/market-card-01.png',
    status,
    statusClass: MarketStatus.getClass(status),
    tags: categoryNames(market),
    organizer: '',
    transportation: [],
  };
};

const mapHistoryMarketCard = (market: UserMarketCardApi): HistoryMarketCardItem => ({
  ...mapMarketCard(market),
  desc: market.summary ?? '',
});

@Component({
  selector: 'app-user-activity-list',
  imports: [UserMarketSearchPanel, UserMarketCard, UserHistoryMarketCard, Pagination],
  templateUrl: './user-activity-list.html',
  styleUrl: './user-activity-list.scss',
})
export class UserActivityList {
  private readonly destroyRef = inject(DestroyRef);

  activeTab: 'current' | 'history' = 'current';
  currentPage = 1;
  pageSize = 6;
  keyword = '';
  selectedCity = '';
  selectedStatus = '';
  selectedCategory = '';
  startDate = '';
  endDate = '';
  markets: MarketCardItem[] = [];
  historyMarkets: HistoryMarketCardItem[] = [];
  marketTotal = 0;
  historyMarketTotal = 0;
  isLoading = false;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly marketApi: UserMarketApiService,
    private readonly alert: AlertService,
  ) {
    this.activeTab = this.router.url.includes('/activity-list/history') ? 'history' : 'current';

    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        this.currentPage = Number(params.get('page')) || 1;
        this.keyword = params.get('keyword') ?? '';
        this.selectedCity = params.get('city') ?? '';
        this.selectedStatus = params.get('status') ?? '';
        this.selectedCategory = params.get('category') ?? '';
        this.startDate = params.get('startDate') ?? '';
        this.endDate = params.get('endDate') ?? '';
        this.loadMarkets();
      });
  }

  get pagedMarkets(): MarketCardItem[] {
    return this.markets;
  }

  get pagedHistoryMarkets(): HistoryMarketCardItem[] {
    return this.historyMarkets;
  }

  get totalItems(): number {
    return this.activeTab === 'history' ? this.historyMarketTotal : this.marketTotal;
  }

  changeTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    void this.router.navigate([
      tab === 'history' ? '/user/activity-list/history' : '/user/activity-list',
    ], {
      queryParams: this.currentQueryParams(1),
    });
  }

  changePage(page: number): void {
    this.currentPage = page;
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.currentQueryParams(page),
      queryParamsHandling: 'merge',
    });
  }

  onSearch(params: UserMarketPanelSearchParams): void {
    this.currentPage = 1;
    this.keyword = params.keyword ?? '';
    this.selectedCity = params.city ?? '';
    this.selectedStatus = params.status ?? '';
    this.selectedCategory = params.category ?? '';
    this.startDate = params.startDate ?? '';
    this.endDate = params.endDate ?? '';
  }

  goToActivityDetail(market: MarketCardItem): void {
    void this.router.navigate(['/user/activity-detail'], {
      queryParams: { marketId: market.id },
      state: { market },
    });
  }

  private currentQueryParams(page: number): Record<string, string | number | null> {
    return {
      page,
      keyword: this.keyword || null,
      city: this.selectedCity || null,
      status: this.selectedStatus || null,
      category: this.selectedCategory || null,
      startDate: this.startDate || null,
      endDate: this.endDate || null,
    };
  }

  private loadMarkets(): void {
    const requestedTab = this.activeTab;
    this.isLoading = true;

    this.marketApi.searchMarkets({
      eventType: requestedTab === 'history' ? '歷史活動' : '目前活動',
      keyword: this.keyword,
      city: this.selectedCity,
      eventStatus: this.selectedStatus,
      categoryNames: this.selectedCategory,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: async (res) => {
        this.isLoading = false;
        if (res.statusCode !== 200 || !res.data) {
          this.clearResults(requestedTab);
          await this.alert.error('查詢市集失敗', res.message || '請稍後再試。');
          return;
        }

        if (requestedTab === 'history') {
          this.historyMarkets = res.data.items.map(mapHistoryMarketCard);
          this.historyMarketTotal = res.data.totalItems;
          return;
        }

        this.markets = res.data.items.map(mapMarketCard);
        this.marketTotal = res.data.totalItems;
      },
      error: async (error) => {
        this.isLoading = false;
        this.clearResults(requestedTab);
        await this.alert.error(
          '查詢市集失敗',
          error.error?.message || '請確認後端服務是否啟動。'
        );
      },
    });
  }

  private clearResults(tab: 'current' | 'history'): void {
    if (tab === 'history') {
      this.historyMarkets = [];
      this.historyMarketTotal = 0;
      return;
    }

    this.markets = [];
    this.marketTotal = 0;
  }
}
