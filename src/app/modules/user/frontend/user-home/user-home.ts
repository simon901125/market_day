import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
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
/** 一般使用者首頁，包含 Hero 輪播、搜尋入口、精選活動與角色導流區塊。 */
export class UserHome implements OnInit, OnDestroy {
  constructor(private router: Router) {}

  /** 目前顯示的 Hero 輪播索引。 */
  currentHeroIndex = 0;
  /** 控制 Hero 文字與背景進場動畫。 */
  isHeroAnimating = true;

  /** Hero 自動輪播計時器。 */
  private heroTimer: ReturnType<typeof setInterval> | null = null;
  /** Hero 自動輪播間隔毫秒數。 */
  private readonly heroInterval = 5000;

  /** 首頁 Hero 輪播資料。 */
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

  /** 首頁精選活動卡片資料，之後可替換成 API 回傳結果。 */
  markets: MarketCardItem[] = [
    {
      id: 'market-2026-summer-green',
      title: '夏日綠意市集',
      start_date: '2026/06/15',
      end_date: '2026/06/21',
      description: '結合手作選物、風格餐飲與親子互動體驗，打造適合週末散步與逛市集的城市綠意空間。',
      time: '10:00 - 18:00',
      location: '台北市 信義區 草悟廣場',
      address: '台北市信義區松高路 11 號',
      city: '台北市',
      area: '信義區',
      category: BrandType.family,
      image: 'assets/images/market/cards/market-card-01.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
      organizer: '小集日企劃團隊',
      transportation: ['捷運市政府站步行約 8 分鐘', '公車市政府站下車', '周邊設有付費停車場'],
    },
    {
      id: 'market-2026-urban-craft',
      title: '城市手作週末',
      start_date: '2026/06/27',
      end_date: '2026/06/28',
      description: '邀請獨立創作者與設計品牌，帶來陶作、布品、插畫與生活小物。',
      time: '11:00 - 19:00',
      location: '台北市 中正區 華山文創園區',
      address: '台北市中正區八德路一段 1 號',
      city: '台北市',
      area: '中正區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-02.png',
      status: MarketStatus.preview,
      statusClass: MarketStatus.getClass(MarketStatus.preview),
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '城市手作企劃',
      transportation: ['捷運忠孝新生站步行約 5 分鐘', '公車華山文創園區站下車'],
    },
    {
      id: 'market-2026-food-picnic',
      title: '午後野餐美食市集',
      start_date: '2026/07/04',
      end_date: '2026/07/05',
      description: '集合甜點、咖啡、輕食與在地農產，適合朋友聚會與家庭野餐。',
      time: '10:30 - 18:30',
      location: '新北市 板橋區 新板萬坪公園',
      address: '新北市板橋區新府路 1 號',
      city: '新北市',
      area: '板橋區',
      category: BrandType.food,
      image: 'assets/images/market/cards/market-card-03.png',
      status: MarketStatus.preview,
      statusClass: MarketStatus.getClass(MarketStatus.preview),
      tags: [BrandType.food, BrandType.family],
      organizer: '午後食光市集',
      transportation: ['捷運板橋站步行約 7 分鐘', '板橋公車站下車後步行可達'],
    },
  ];

  /** 啟動 Hero 自動輪播。 */
  ngOnInit(): void {
    this.startHeroAutoPlay();
  }

  /** 離開頁面時停止計時器，避免背景持續執行。 */
  ngOnDestroy(): void {
    this.stopHeroAutoPlay();
  }

  /** 目前應顯示的 Hero 資料。 */
  get currentHero() {
    return this.heroSlides[this.currentHeroIndex];
  }

  /** 建立自動輪播計時器。 */
  private startHeroAutoPlay(): void {
    this.heroTimer = setInterval(() => {
      this.nextHero();
    }, this.heroInterval);
  }

  /** 清除自動輪播計時器。 */
  private stopHeroAutoPlay(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
      this.heroTimer = null;
    }
  }

  /** 切換 Hero 並觸發淡入動畫。 */
  private changeHero(index: number): void {
    this.isHeroAnimating = false;

    setTimeout(() => {
      this.currentHeroIndex = index;
      this.isHeroAnimating = true;
    }, 450);
  }

  /** 切到下一張 Hero。 */
  nextHero(): void {
    const nextIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
    this.changeHero(nextIndex);
  }

  /** 使用者手動下一張，並重置自動輪播時間。 */
  nextHeroByUser(): void {
    this.nextHero();
    this.resetHeroAutoPlay();
  }

  /** 切到上一張 Hero。 */
  prevHero(): void {
    const prevIndex = (this.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
    this.changeHero(prevIndex);
  }

  /** 使用者手動上一張，並重置自動輪播時間。 */
  prevHeroByUser(): void {
    this.prevHero();
    this.resetHeroAutoPlay();
  }

  /** 點擊輪播點點切換指定 Hero。 */
  goToHero(index: number): void {
    if (index === this.currentHeroIndex) {
      return;
    }

    this.changeHero(index);
    this.resetHeroAutoPlay();
  }

  /** 重新計算自動輪播時間，避免手動操作後立刻跳下一張。 */
  private resetHeroAutoPlay(): void {
    this.stopHeroAutoPlay();
    this.startHeroAutoPlay();
  }

  /** 前往活動詳情，帶上 marketId 讓重新整理也能還原資料。 */
  goToActivityDetail(market: MarketCardItem): void {
    this.router.navigate(['/user/activity-detail'], {
      queryParams: { marketId: market.id },
      state: { market },
    });
  }
}
