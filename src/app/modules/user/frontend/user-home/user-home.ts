import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MarketCardItem } from '../../../../models/interface/MarketCardItem';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { BrandType } from '../../../../models/type/BrandType ';
import { UserMarketCard } from '../shared/user-market-card/user-market-card';
import { UserMarketSearchPanel } from '../shared/user-market-search-panel/user-market-search-panel';

@Component({
  selector: 'app-user-home',
  imports: [CommonModule, RouterLink, UserMarketSearchPanel, UserMarketCard],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  currentHeroIndex = 0;
  isHeroAnimating = true;

  private heroTimer: ReturnType<typeof setInterval> | null = null;
  private readonly heroInterval = 5000;

  heroSlides = [
    {
      title: '輕鬆打造專屬的<br /><span>市集活動</span>',
      desc: '活動建立、攤商審核到公告通知，<br />一站式完成所有管理流程。',
      image: 'assets/images/user/home/user-home-hero-market-01.png',
      primaryText: '探索市集',
      primaryLink: '/user/activity-list',
      primaryIcon: 'bi bi-search',
      secondaryText: '品牌探索',
      secondaryLink: '/user/brands',
      secondaryIcon: 'bi bi-stars',
    },
    {
      title: '讓更多人看見你的<br /><span>品牌作品</span>',
      desc: '串連市集活動與品牌曝光，<br />讓好作品被更多人遇見。',
      image: 'assets/images/user/home/user-home-hero-market-02.png',
      primaryText: '前往攤主專區',
      primaryLink: '/vendor/home',
      primaryIcon: 'bi bi-shop-window',
      secondaryText: '了解功能',
      secondaryLink: '/vendor/home',
      secondaryIcon: 'bi bi-clipboard-check',
    },
    {
      title: '讓活動籌備更清楚<br /><span>也更有效率</span>',
      desc: '從活動建立、攤商審核到報名通知，<br />協助主辦方完成市集籌備流程。',
      image: 'assets/images/user/home/user-home-hero-market-03.png',
      primaryText: '主辦方專區',
      primaryLink: '/organizer/home',
      primaryIcon: 'bi bi-calendar-event',
      secondaryText: '了解流程',
      secondaryLink: '/organizer/home',
      secondaryIcon: 'bi bi-grid',
    },
    {
      title: '讓每一場市集<br />都成為<span>期待的小日子</span>',
      desc: '小集日串連活動、品牌與逛市集的人，<br />把生活裡的美好慢慢聚在一起。',
      image: 'assets/images/user/home/user-home-hero-market-04.png',
      primaryText: '關於小集日',
      primaryLink: '/user/about',
      primaryIcon: 'bi bi-info-circle',
      secondaryText: '聯絡我們',
      secondaryLink: '/user/about',
      secondaryIcon: 'bi bi-chat-dots',
    },
  ];

  markets: MarketCardItem[] = [
    {
      title: '草悟野餐市集',
      start_date: '2026/06/15',
      end_date: '2026/06/21',
      description: '在城市綠意裡展開週末野餐，集合手作甜點、植栽選物與親子互動體驗。',
      time: '10:00 - 18:00',
      location: '台中市北區 審計新村',
      address: '台中市北區育才街99號',
      city: '台中市',
      area: '北區',
      category: BrandType.family,
      image: 'assets/images/market/cards/market-card-01.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
      organizer: '小集日活動企劃',
      transportation: [
        '捷運：文心森林公園站（G10），步行約 8 分鐘',
        '公車：豐樂 53、73、75、85、99，於「文心森林公園站」下車',
        '開車：公園周邊設有收費停車場',
      ],
    },
    {
      title: '台北插畫生活節',
      start_date: '2026/06/27',
      end_date: '2026/06/28',
      description: '以插畫、紙品與小物為主題，讓創作者用溫柔筆觸說出生活裡的故事。',
      time: '11:00 - 19:00',
      location: '台北市中正區 華山1914文化創意產業園區',
      address: '台北市中正區八德路一段1號',
      city: '台北市',
      area: '中正區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-02.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '台北創作生活協會',
      transportation: ['捷運：忠孝新生站 1 號出口', '公車：藍5、藍7、藍10路'],
    },
    {
      title: '府城慢食選物市集',
      start_date: '2026/07/04',
      end_date: '2026/07/05',
      description: '串連台南在地小農、甜點與風味飲品，把日常飲食變成一場慢慢逛的旅行。',
      time: '10:30 - 18:30',
      location: '台南市中西區 藍晒圖文創園區',
      address: '台南市中西區西門路一段689巷',
      city: '台南市',
      area: '中西區',
      category: BrandType.food,
      image: 'assets/images/market/cards/market-card-03.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.food, BrandType.family],
      organizer: '府城生活策展',
      transportation: ['公車：藍幹線、紅幹線', '台南火車站轉乘公車約 12 分鐘'],
    },
  ];

  ngOnInit(): void {
    this.startHeroAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopHeroAutoPlay();
  }

  get currentHero() {
    return this.heroSlides[this.currentHeroIndex];
  }

  private startHeroAutoPlay(): void {
    this.heroTimer = setInterval(() => {
      this.nextHero();
    }, this.heroInterval);
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
    const nextIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
    this.changeHero(nextIndex);
  }

  nextHeroByUser(): void {
    this.nextHero();
    this.resetHeroAutoPlay();
  }

  prevHero(): void {
    const prevIndex = (this.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.changeHero(prevIndex);
  }

  prevHeroByUser(): void {
    this.prevHero();
    this.resetHeroAutoPlay();
  }

  goToHero(index: number): void {
    if (index === this.currentHeroIndex) {
      return;
    }

    this.changeHero(index);
    this.resetHeroAutoPlay();
  }

  private resetHeroAutoPlay(): void {
    this.stopHeroAutoPlay();
    this.startHeroAutoPlay();
  }

  goToActivityDetail(market: MarketCardItem): void {
    this.router.navigate(['/user/activity-detail'], {
      state: { market },
    });
  }
}
