import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnDestroy, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';

import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { UserMarketCardApi } from '../../../../models/interface/user/UserPublicApi';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { UserMarketApiService } from '../../services/user-market-api.service';
import { UserMarketCard } from '../shared/user-market-card/user-market-card';
import { UserMarketSearchPanel } from '../shared/user-market-search-panel/user-market-search-panel';

const formatApiDate = (value: string | null | undefined): string =>
  value ? value.replace(/-/g, '/') : '';

const mapMarketCard = (market: UserMarketCardApi): MarketCardItem => {
  const tags = (market.categories ?? []).map((category) => category.name).filter(Boolean);
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
    category: tags[0] ?? '',
    image: market.coverImageUrl ?? 'assets/images/market/cards/market-card-01.png',
    status,
    statusClass: MarketStatus.getClass(status),
    tags,
    organizer: '',
    transportation: [],
  };
};

@Component({
  selector: 'app-user-home',
  imports: [CommonModule, RouterLink, UserMarketSearchPanel, UserMarketCard],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome implements OnInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly router: Router,
    private readonly marketApi: UserMarketApiService,
  ) {}

  currentHeroIndex = 0;
  isHeroAnimating = true;
  markets: MarketCardItem[] = [];
  isMarketsLoading = false;

  private heroTimer: ReturnType<typeof setInterval> | null = null;
  private readonly heroInterval = 5000;

  heroSlides = [
    {
      title: '讓週末多一點<br /><span>城市市集的溫度</span>',
      desc: '從手作選物、風格餐飲到親子活動，找到最適合你的市集行程。',
      image: 'assets/images/user/home/user-home-hero-market-01.png',
      primaryText: '探索市集',
      primaryLink: '/user/activity-list',
      primaryIcon: 'bi bi-search',
      secondaryText: '品牌探索',
      secondaryLink: '/user/brands',
      secondaryIcon: 'bi bi-stars',
    },
    {
      title: '把作品帶到人群裡<br /><span>遇見喜歡你的客人</span>',
      desc: '小集日讓攤主更容易找到合適活動，完成報名、審核與攤位管理。',
      image: 'assets/images/user/home/user-home-hero-market-02.png',
      primaryText: '成為攤主',
      primaryLink: '/vendor/home',
      primaryIcon: 'bi bi-shop-window',
      secondaryText: '了解流程',
      secondaryLink: '/vendor/home',
      secondaryIcon: 'bi bi-clipboard-check',
    },
    {
      title: '建立一場有記憶點的<br /><span>品牌市集活動</span>',
      desc: '主辦方可以管理活動資料、報名名單、攤位配置與發布流程。',
      image: 'assets/images/user/home/user-home-hero-market-03.png',
      primaryText: '主辦方專區',
      primaryLink: '/organizer/home',
      primaryIcon: 'bi bi-calendar-event',
      secondaryText: '查看功能',
      secondaryLink: '/organizer/home',
      secondaryIcon: 'bi bi-grid',
    },
  ];

  ngOnInit(): void {
    this.startHeroAutoPlay();
    this.loadFeaturedMarkets();
  }

  ngOnDestroy(): void {
    this.stopHeroAutoPlay();
  }

  get currentHero() {
    return this.heroSlides[this.currentHeroIndex];
  }

  private loadFeaturedMarkets(): void {
    this.isMarketsLoading = true;
    this.marketApi.searchMarkets({ eventType: '目前活動', page: 1, pageSize: 3 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isMarketsLoading = false;
          this.markets = res.statusCode === 200 && res.data
            ? res.data.items.map(mapMarketCard)
            : [];
        },
        error: () => {
          this.isMarketsLoading = false;
          this.markets = [];
        },
      });
  }

  private startHeroAutoPlay(): void {
    this.heroTimer = setInterval(() => this.nextHero(), this.heroInterval);
  }

  private stopHeroAutoPlay(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = null;
    }
  }

  private changeHero(index: number): void {
    this.isHeroAnimating = false;
    setTimeout(() => {
      this.currentHeroIndex = index;
      this.isHeroAnimating = true;
    }, 450);
  }

  nextHero(): void {
    this.changeHero((this.currentHeroIndex + 1) % this.heroSlides.length);
  }

  nextHeroByUser(): void {
    this.nextHero();
    this.resetHeroAutoPlay();
  }

  prevHero(): void {
    this.changeHero((this.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  prevHeroByUser(): void {
    this.prevHero();
    this.resetHeroAutoPlay();
  }

  goToHero(index: number): void {
    if (index === this.currentHeroIndex) return;
    this.changeHero(index);
    this.resetHeroAutoPlay();
  }

  private resetHeroAutoPlay(): void {
    this.stopHeroAutoPlay();
    this.startHeroAutoPlay();
  }

  goToActivityDetail(market: MarketCardItem): void {
    void this.router.navigate(['/user/activity-detail'], {
      queryParams: { marketId: market.id },
      state: { market },
    });
  }
}
