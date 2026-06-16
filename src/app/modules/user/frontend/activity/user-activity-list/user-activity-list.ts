import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MarketCardItem } from '../../../../../models/MarketCardItem';
import { HistoryMarketCardItem } from '../../../../../models/HistoryMarketCardItem';
import { BrandType } from '../../../../../models/type/BrandType ';
import { MarketStatus } from '../../../../../models/status/MarketStatus';

import { UserMarketSearchPanel } from '../../shared/user-market-search-panel/user-market-search-panel';
import { Pagination } from '../../../../shared/pagination/pagination';
import { UserMarketCard } from '../../shared/user-market-card/user-market-card';
import { UserHistoryMarketCard } from '../../brand/user-history-market-card/user-history-market-card';

@Component({
  selector: 'app-user-activity-list',
  imports: [
    UserMarketSearchPanel,
    UserMarketCard,
    UserHistoryMarketCard,
    Pagination,
  ],
  templateUrl: './user-activity-list.html',
  styleUrl: './user-activity-list.scss',
})
export class UserActivityList {
  constructor(private router: Router) {
    this.activeTab = this.router.url.includes('/activity-list/history')
      ? 'history'
      : 'current';
  }

  /** 目前所在的標籤 */
  activeTab: 'current' | 'history' = 'current';

  /** 目前頁碼 */
  currentPage = 1;

  /** 每頁顯示筆數 */
  pageSize = 6;

  /** 目前頁面要顯示的市集 */
  get pagedMarkets(): MarketCardItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.markets.slice(startIndex, startIndex + this.pageSize);
  }

  /** 目前頁面要顯示的歷史市集 */
  get pagedHistoryMarkets(): HistoryMarketCardItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.historyMarkets.slice(startIndex, startIndex + this.pageSize);
  }

  /** 切換目前/歷史活動 */
  changeTab(tab: 'current' | 'history'): void {
    this.currentPage = 1;
    this.router.navigate([
      tab === 'history'
        ? '/user/activity-list/history'
        : '/user/activity-list',
    ]);
  }

  /** 接收共用分頁元件傳回的頁碼 */
  changePage(page: number): void {
    this.currentPage = page;
  }

  /** 導航到市集詳情頁 */
  goToActivityDetail(market: MarketCardItem): void {
    this.router.navigate(['/user/activity-detail'], {
      state: { market },
    });
  }

  /** 目前市集列表 */
  markets: MarketCardItem[] = [
    {
      title: '草地野餐市集',
      start_date: '2026/06/04',
      end_date: '2026/06/20',
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
      transportation: ['捷運綠線：草悟道站', '公車：5、10、20、30路'],
    },
    {
      title: '台北精品咖啡生活節',
      start_date: '2024/05/24',
      end_date: '2024/05/26',
      description: '體驗精品咖啡的香醇與文化，享受慢活的愜意時光。',
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
      transportation: ['捷運紅線：忠孝新生站', '公車：藍5、藍7、藍10路'],
    },
    {
      title: '手作設計市集',
      start_date: '2026/05/25',
      end_date: '2026/06/26',
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
      transportation: ['公車：綠幹線、藍幹線', '計程車：台南火車站搭乘約10分鐘'],
    },
    {
      title: '山系生活戶外市集',
      start_date: '2024/05/07',
      end_date: '2024/06/09',
      description: '結合戶外活動與生活風格，提供山系愛好者一個交流的平台。',
      time: '10:00 - 18:00',
      location: '新竹市西區 新竹公園',
      address: '新竹市西區公園路123號',
      city: '新竹市',
      area: '西區',
      category: '戶外生活',
      image: 'assets/images/market/cards/market-card-04.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.fashion, BrandType.family],
      organizer: '新竹市政府',
      transportation: ['捷運：新竹站', '公車：綠1、綠2、藍1路'],
    },
    {
      title: '毛孩友善市集',
      start_date: '2024/06/08',
      end_date: '2024/06/09',
      description: '專為毛孩和主人打造的友善市集，提供各式寵物用品和活動。',
      time: '10:00 - 18:00',
      location: '高雄市鼓山區 駁二藝術特區',
      address: '高雄市鼓山區駁二藝術特區',
      city: '高雄市',
      area: '鼓山區',
      category: '寵物',
      image: 'assets/images/market/cards/market-card-05.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.pet, BrandType.family],
      organizer: '高雄市政府',
      transportation: ['捷運紅線：鹽埕埔站', '公車：紅1、紅2、藍1路'],
    },
    {
      title: '植感生活市集',
      start_date: '2024/06/15',
      end_date: '2024/06/16',
      description: '以植物為主題的生活市集，提供多樣化的植栽和綠色生活用品。',
      time: '10:00 - 18:00',
      location: '台中市北區 審計新村',
      address: '台中市北區育才街99號',
      city: '台中市',
      area: '北區',
      category: '植物',
      image: 'assets/images/market/cards/market-card-06.png',
      status: MarketStatus.preview,
      statusClass: MarketStatus.getClass(MarketStatus.preview),
      tags: [BrandType.plant, BrandType.handmade, BrandType.family],
      organizer: '台中市政府',
      transportation: ['捷運：台中站', '公車：綠1、綠2、藍1路'],
    },
    {
      title: '城市甜點生活市集',
      start_date: '2024/07/05',
      end_date: '2024/07/07',
      description: '集合甜點、咖啡與生活選物，打造週末午後的小旅行。',
      time: '11:00 - 19:00',
      location: '台北市信義區 松山文創園區',
      address: '台北市信義區光復南路133號',
      city: '台北市',
      area: '信義區',
      category: '餐飲美食',
      image: 'assets/images/market/cards/market-card-07.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.food, BrandType.handmade],
      organizer: '台北市政府',
      transportation: ['捷運：國父紀念館站', '公車：204、212、278路'],
    },
    {
      title: '親子童趣假日市集',
      start_date: '2024/07/12',
      end_date: '2024/07/14',
      description: '親子手作、童書、玩具與戶外活動，一起度過療癒假日。',
      time: '10:00 - 18:00',
      location: '桃園市中壢區 青埔公園',
      address: '桃園市中壢區高鐵南路二段',
      city: '桃園市',
      area: '中壢區',
      category: '親子家庭',
      image: 'assets/images/market/cards/market-card-08.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.family, BrandType.toy],
      organizer: '桃園市政府',
      transportation: ['高鐵：桃園站', '捷運：A18 高鐵桃園站'],
    },
    {
      title: '夏夜音樂手作市集',
      start_date: '2024/07/19',
      end_date: '2024/07/21',
      description: '結合音樂表演與手作品牌，打造夏夜限定市集體驗。',
      time: '15:00 - 21:00',
      location: '台中市西屯區 中央公園',
      address: '台中市西屯區經貿五路',
      city: '台中市',
      area: '西屯區',
      category: '文創手作',
      image: 'assets/images/market/cards/market-card-09.png',
      status: MarketStatus.preview,
      statusClass: MarketStatus.getClass(MarketStatus.preview),
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '台中市政府',
      transportation: ['公車：300、301、302路', '自行開車：中央公園停車場'],
    },
    {
      title: '港邊海風選物市集',
      start_date: '2024/08/02',
      end_date: '2024/08/04',
      description: '在港邊吹著海風，探索在地品牌與生活風格選物。',
      time: '12:00 - 20:00',
      location: '高雄市鹽埕區 駁二藝術特區',
      address: '高雄市鹽埕區大勇路1號',
      city: '高雄市',
      area: '鹽埕區',
      category: '生活風格',
      image: 'assets/images/market/cards/market-card-10.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.fashion, BrandType.handmade],
      organizer: '高雄市政府',
      transportation: ['捷運：鹽埕埔站', '輕軌：駁二大義站'],
    },
  ];

  /** 歷史市集列表 */
  historyMarkets: HistoryMarketCardItem[] = [
    {
      title: '小樹市集｜台灣歷史博物館戶外廣場',
      start_date: '2024/06/15',
      end_date: '2024/06/16',
      time: '10:00 - 18:00',
      location: '國立臺灣歷史博物館戶外廣場',
      address: '台南市安南區長和路一段250號',
      image: 'assets/images/user/activity/history/history-market-01.png',
      status: '已結束',
      statusClass: 'ended',
      tags: [BrandType.family],
      category: BrandType.family,
      city: '台南市',
      area: '安南區',
      desc: '在歷史與綠意之間，孩子們自在奔跑，大小朋友都能找到喜歡的故事與手作好物。',
      description: '在歷史與綠意交織的戶外廣場，集合親子手作、特色選物與在地美食，讓大小朋友一起度過輕鬆愉快的週末。',
      organizer: '小樹生活市集',
      transportation: ['台南火車站轉乘公車至臺灣歷史博物館站', '館區設有汽機車停車場'],
    },
    {
      title: '小火柴文創市集｜水交社文化園區',
      start_date: '2024/05/18',
      end_date: '2024/05/19',
      time: '11:00 - 18:00',
      location: '水交社文化園區',
      address: '台南市南區興中街118號',
      image: 'assets/images/user/activity/history/history-market-02.png',
      status: '已結束',
      statusClass: 'ended',
      tags: [BrandType.handmade],
      category: BrandType.handmade,
      city: '台南市',
      area: '南區',
      desc: '老眷村裡的新故事，文創與手作的溫度，一起感受生活的美好與創意的力量。',
      description: '以老眷村的人文景色為舞台，邀請插畫、陶作、布品與獨立甜點品牌，延續水交社的生活記憶與創作溫度。',
      organizer: '小火柴文創團隊',
      transportation: ['台南火車站轉乘市區公車至水交社站', '園區周邊設有公有停車場'],
    },
    {
      title: '森林手作生活節｜台中審計新村',
      start_date: '2024/04/20',
      end_date: '2024/04/21',
      time: '11:00 - 19:00',
      location: '審計新村',
      address: '台中市西區民生路368巷',
      image: 'assets/images/user/activity/history/history-market-03.png',
      status: '已結束',
      statusClass: 'ended',
      tags: [BrandType.handmade],
      category: BrandType.handmade,
      city: '台中市',
      area: '西區',
      desc: '在老屋與綠樹之間，慢下腳步，享受手作、設計與生活風格的美好日常。',
      description: '老屋巷弄裡聚集木作、花藝、香氛與生活選品，透過創作者的作品，感受城市中自然柔和的生活節奏。',
      organizer: '森林手作生活節',
      transportation: ['台中火車站轉乘公車至英才郵局站', '建議搭乘大眾運輸前往'],
    },
    {
      title: '夏日選物散步市集｜高雄駁二藝術特區',
      start_date: '2024/03/09',
      end_date: '2024/03/10',
      time: '14:00 - 20:00',
      location: '駁二藝術特區大勇區',
      address: '高雄市鹽埕區大勇路1號',
      image: 'assets/images/user/activity/history/history-market-04.png',
      status: '已結束',
      statusClass: 'ended',
      tags: [BrandType.fashion],
      category: BrandType.fashion,
      city: '高雄市',
      area: '鹽埕區',
      desc: '海風、陽光與好物相遇，在駁二散步挖寶，感受港都的夏日魅力。',
      description: '沿著港灣展開的夏日散步市集，集結服飾配件、風格選物與特色飲品，在海風與夕陽中探索生活好物。',
      organizer: '港都散步企劃',
      transportation: ['高雄捷運鹽埕埔站步行約8分鐘', '輕軌駁二大義站下車即可抵達'],
    },
  ];
}
