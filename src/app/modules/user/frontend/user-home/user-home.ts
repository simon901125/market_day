import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { UserMarketSearchPanel } from '../shared/user-market-search-panel/user-market-search-panel';
import { MarketCardItem } from '../../../../models/MarketCardItem';
import { BrandType } from '../../../../models/type/BrandType ';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { CommonModule } from '@angular/common';
import { UserMarketCard } from '../shared/user-market-card/user-market-card';

@Component({
  selector: 'app-user-home',
  imports: [CommonModule, RouterLink, UserMarketSearchPanel, UserMarketCard],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome implements OnInit, OnDestroy{
  constructor(private router: Router) {}

  // 目前顯示的 Hero 輪播索引，預設顯示第一張
  currentHeroIndex = 0;

  // 控制 Hero 文字與圖片的動畫狀態
  // true：顯示淡入效果
  // false：先淡出，等待切換下一張資料
  isHeroAnimating = true;

  // 儲存自動輪播的計時器
  private heroTimer: any;

  // 自動輪播間隔時間，單位是毫秒
  private readonly heroInterval = 5000;

  // Hero 輪播資料
  // 每一筆代表一張輪播圖，包含標題、描述、圖片與兩個按鈕資訊
  heroSlides = [
    {
      title: '今天想去哪個<br /><span>市集</span>走走？',
      desc: '探索城市裡最有溫度的市集活動，<br />發現手作、美食與生活靈感。',
      image: 'assets/images/user/home/user-home-hero-market-01.png',
      primaryText: '探索市集',
      primaryLink: '/user/activity-list',
      primaryIcon: 'bi bi-search',
      secondaryText: '探索品牌',
      secondaryLink: '/user/brands',
      secondaryIcon: 'bi bi-stars',
    },
    {
      title: '讓更多人看見你的<br /><span>品牌故事</span>',
      desc: '快速報名市集活動，建立品牌頁面，<br />把你的作品帶到更多人面前。',
      image: 'assets/images/user/home/user-home-hero-market-02.png',
      primaryText: '攤主專區',
      primaryLink: '/vendor/home',
      primaryIcon: 'bi bi-shop-window',
      secondaryText: '報名活動',
      secondaryLink: '/vendor/home',
      secondaryIcon: 'bi bi-clipboard-check',
    },
    {
      title: '輕鬆打造專屬的<br /><span>市集活動</span>',
      desc: '從活動建立、攤商審核到公告通知，<br />一站式完成所有管理流程。',
      image: 'assets/images/user/home/user-home-hero-market-03.png',
      primaryText: '主辦方專區',
      primaryLink: '/organizer/home',
      primaryIcon: 'bi bi-calendar-event',
      secondaryText: '了解功能',
      secondaryLink: '/organizer/home',
      secondaryIcon: 'bi bi-grid',
    },
    {
      title: '讓每一次相遇，<br />都成為<span>生活的靈感</span>',
      desc: '小集日致力於連結品牌、攤主與喜歡市集的人，<br />打造屬於城市的美好交流平台。',
      image: 'assets/images/user/home/user-home-hero-market-04.png',
      primaryText: '認識小集日',
      primaryLink: '/user/about',
      primaryIcon: 'bi bi-info-circle',
      secondaryText: '聯絡我們',
      secondaryLink: '/user/about',
      secondaryIcon: 'bi bi-chat-dots',
    },
  ];

  // 首頁顯示的近期市集活動資料
  markets: MarketCardItem[] = [
    {
      title: '草地野餐市集',
      start_date: '2024/05/24',
      end_date: '2024/05/26',
      description: '在草地上享受美食和音樂，與家人朋友共度美好時光。',
      time: '10:00 - 18:00',
      location: '台中市西區 草悟道',
      address: '台中市西區英才路534號',
      city: '台中市',
      area: '西區',
      category: '親子家庭',
      image: 'assets/images/market/cards/market-card-01.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
      organizer: '台中市政府',
      transportation: ['捷運綠線：草悟道站', '公車：5、10、20、30路']
    },
    {
      title: '台北精品咖啡生活節',
      start_date: '2024/05/24',
      end_date: '2024/05/26',
      description: '體驗精品咖啡的香醇與文化，享受慢活的惬意時光。',
      time: '10:00 - 18:00',
      location: '台北市中山區 華山1914文創園區',
      address: '台北市中山區復興南路一段1號',
      city: '台北市',
      area: '中山區',
      category: '咖啡茶飲',
      image: 'assets/images/market/cards/market-card-02.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
      organizer: '台北市政府',
      transportation: ['捷運紅線：忠孝新生站', '公車：藍5、藍7、藍10路']
    },
    {
      title: '手作設計市集',
      start_date: '2024/05/25',
      end_date: '2024/05/26',
      description: '匯聚各式手作設計品牌，展現創意與工藝的魅力。',
      time: '10:00 - 18:00',
      location: '台南市中西區 藍晒圖文創園區',
      address: '台南市中西區創意路123號',
      city: '台南市',
      area: '中西區',
      category: '手作設計',
      image: 'assets/images/market/cards/market-card-03.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.handmade, BrandType.fashion, BrandType.toy],
      organizer: '台南市政府',
      transportation: ['公車：綠幹線、藍幹線', '計程車：台南火車站搭乘約10分鐘']
    },
  ];

  ngOnInit() {
    this.startHeroAutoPlay();
  }

  ngOnDestroy() {
    this.stopHeroAutoPlay();
  }

  // 取得目前要顯示的 Hero 資料
  // HTML 會透過 currentHero 取得目前的標題、圖片、描述與按鈕內容
  get currentHero() {
    return this.heroSlides[this.currentHeroIndex];
  }

  /**
   * 開始自動輪播
   */
  private startHeroAutoPlay() {
    this.heroTimer = setInterval(() => {
      this.nextHero();
    }, this.heroInterval);
  }

  /**
   * 停止自動輪播
   */
  private stopHeroAutoPlay() {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
    }
  }

  /**
   * 切換 Hero 輪播
   * 先淡出目前的圖片和文字，再切換到新的輪播資料，最後淡入新內容
   *
   * @param index 要切換到的輪播索引
   */
  private changeHero(index: number) {
    // 先關閉動畫 class，讓目前圖片與文字淡出
    this.isHeroAnimating = false;

    // 等淡出一小段時間後，再切換資料
    setTimeout(() => {
      // 切換目前顯示的輪播索引
      this.currentHeroIndex = index;

      // 重新開啟動畫 class，讓新的圖片與文字淡入
      this.isHeroAnimating = true;
    }, 450);
  }

  /**
   * 切換到下一張 Hero
   */
  nextHero() {
    const nextIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
    this.changeHero(nextIndex);
  }

  /**
   * 使用者點擊下一張
   * 點擊後會重新計算自動輪播時間
   */
  nextHeroByUser() {
    this.nextHero();
    this.resetHeroAutoPlay();
  }

  /**
   * 切換到上一張 Hero
   */
  prevHero() {
    const prevIndex =
      (this.currentHeroIndex - 1 + this.heroSlides.length) %
      this.heroSlides.length;

    this.changeHero(prevIndex);
  }

  /**
   * 使用者點擊上一張
   * 點擊後會重新計算自動輪播時間
   */
  prevHeroByUser() {
    this.prevHero();
    this.resetHeroAutoPlay();
  }

  /**
   * 點擊下方圓點切換到指定 Hero
   * @param index 要切換到的輪播索引
   */
  goToHero(index: number) {
    if (index === this.currentHeroIndex) return;

    this.changeHero(index);
    this.resetHeroAutoPlay();
  }

  /**
   * 重新計算自動輪播時間
   */
  private resetHeroAutoPlay() {
    this.stopHeroAutoPlay();
    this.startHeroAutoPlay();
  }
  
  /**
   * 導航到市集詳情頁
   * @param market 選擇的市集
   */
  goToActivityDetail(market: MarketCardItem) {
    // 這裡可以根據實際路由設定來導航到市集詳情頁
    this.router.navigate(['/user/activity-detail'], {
      // 使用 state 傳遞選擇的市集數據
      state: { market: market }
    });
  }
}