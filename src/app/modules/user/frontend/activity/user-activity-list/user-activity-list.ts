import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MarketCardItem } from '../../../../../models/interface/MarketCardItem';
import { HistoryMarketCardItem } from '../../../../../models/interface/HistoryMarketCardItem';
import { BrandType } from '../../../../../models/type/BrandType ';
import { MarketStatus } from '../../../../../models/status/MarketStatus';

import { UserMarketSearchPanel } from '../../shared/user-market-search-panel/user-market-search-panel';
import { Pagination } from '../../../../shared/pagination/pagination';
import { UserMarketCard } from '../../shared/user-market-card/user-market-card';
import { UserHistoryMarketCard } from '../../shared/user-history-market-card/user-history-market-card';

type MarketSample = Omit<MarketCardItem, 'status' | 'statusClass'>;
type HistoryMarketSample = Omit<HistoryMarketCardItem, 'status' | 'statusClass'>;

const DAY_MS = 1000 * 60 * 60 * 24;

const parseMarketDate = (value: string): Date => {
  const [year, month, day] = value.split('/').map(Number);
  return new Date(year, month - 1, day);
};

const todayStart = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

const resolveCurrentMarketStatus = (market: Pick<MarketCardItem, 'start_date' | 'end_date' | 'infoDate'>): string => {
  const today = todayStart();
  const startDate = parseMarketDate(market.start_date);
  const endDate = parseMarketDate(market.end_date);
  const infoDate = market.infoDate ? parseMarketDate(market.infoDate) : startDate;

  if (today > endDate) {
    return MarketStatus.ended;
  }

  if (today >= startDate && today <= endDate) {
    return MarketStatus.active;
  }

  return today >= infoDate ? MarketStatus.upcoming : MarketStatus.preview;
};

const withCurrentStatus = (market: MarketSample): MarketCardItem => {
  const status = resolveCurrentMarketStatus(market);
  return {
    ...market,
    status,
    statusClass: MarketStatus.getClass(status),
  };
};

const withEndedStatus = (market: HistoryMarketSample): HistoryMarketCardItem => ({
  ...market,
  status: MarketStatus.ended,
  statusClass: MarketStatus.getClass(MarketStatus.ended),
});

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

  activeTab: 'current' | 'history' = 'current';
  currentPage = 1;
  pageSize = 6;

  private readonly marketSamples: MarketSample[] = [
    {
      title: '草悟野餐市集',
      start_date: '2026/06/15',
      end_date: '2026/06/21',
      infoDate: '2026/05/20',
      description: '在城市綠意裡展開週末野餐，集合手作甜點、植栽選物與親子互動體驗。',
      time: '10:00 - 18:00',
      location: '台中市北區 審計新村',
      address: '台中市北區育才街99號',
      city: '台中市',
      area: '北區',
      category: BrandType.family,
      image: 'assets/images/market/cards/market-card-01.png',
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
      infoDate: '2026/05/28',
      description: '以插畫、紙品與小物為主題，讓創作者用溫柔筆觸說出生活裡的故事。',
      time: '11:00 - 19:00',
      location: '台北市中正區 華山1914文化創意產業園區',
      address: '台北市中正區八德路一段1號',
      city: '台北市',
      area: '中正區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-02.png',
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '台北創作生活協會',
      transportation: ['捷運：忠孝新生站 1 號出口', '公車：藍5、藍7、藍10路'],
    },
    {
      title: '府城慢食選物市集',
      start_date: '2026/07/04',
      end_date: '2026/07/05',
      infoDate: '2026/06/05',
      description: '串連台南在地小農、甜點與風味飲品，把日常飲食變成一場慢慢逛的旅行。',
      time: '10:30 - 18:30',
      location: '台南市中西區 藍晒圖文創園區',
      address: '台南市中西區西門路一段689巷',
      city: '台南市',
      area: '中西區',
      category: BrandType.food,
      image: 'assets/images/market/cards/market-card-03.png',
      tags: [BrandType.food, BrandType.family],
      organizer: '府城生活策展',
      transportation: ['公車：藍幹線、紅幹線', '台南火車站轉乘公車約 12 分鐘'],
    },
    {
      title: '新竹風土手作日',
      start_date: '2026/07/18',
      end_date: '2026/07/19',
      infoDate: '2026/06/18',
      description: '把竹風、木作與布藝帶進午後廣場，適合慢慢挑選有溫度的生活器物。',
      time: '10:00 - 18:00',
      location: '新竹市東區 將軍村開放圖書資訊園區',
      address: '新竹市東區金城一路69號',
      city: '新竹市',
      area: '東區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-04.png',
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '新竹手作文化推廣會',
      transportation: ['台鐵：新竹站轉乘公車', '公車：綠1、綠2、藍1路'],
    },
    {
      title: '港邊寵物生活市集',
      start_date: '2026/08/01',
      end_date: '2026/08/02',
      infoDate: '2026/07/01',
      description: '寵物友善品牌、手作零食與戶外用品一次集結，陪毛孩一起吹海風。',
      time: '15:00 - 21:00',
      location: '高雄市鹽埕區 駁二大義倉庫',
      address: '高雄市鹽埕區大義街2號',
      city: '高雄市',
      area: '鹽埕區',
      category: BrandType.pet,
      image: 'assets/images/market/cards/market-card-05.png',
      tags: [BrandType.pet, BrandType.family],
      organizer: '高雄港邊生活節',
      transportation: ['捷運：鹽埕埔站步行約 8 分鐘', '輕軌：駁二大義站下車'],
    },
    {
      title: '綠意植感週末市集',
      start_date: '2026/08/15',
      end_date: '2026/08/16',
      infoDate: '2026/07/20',
      description: '從多肉植物到居家植栽，邀請大家在城市裡找到一點柔軟的綠。',
      time: '10:00 - 18:00',
      location: '台中市西區 勤美草悟道',
      address: '台中市西區公益路68號周邊',
      city: '台中市',
      area: '西區',
      category: BrandType.plant,
      image: 'assets/images/market/cards/market-card-06.png',
      tags: [BrandType.plant, BrandType.handmade],
      organizer: '草悟植感企劃',
      transportation: ['公車：300、301、302路', '開車：周邊收費停車場'],
    },
    {
      title: '松菸夏夜文創市集',
      start_date: '2026/09/05',
      end_date: '2026/09/06',
      infoDate: '2026/08/01',
      description: '夜間限定的文創選物、香氛與輕食品牌，讓夏夜多一點散步的理由。',
      time: '16:00 - 21:00',
      location: '台北市信義區 松山文創園區',
      address: '台北市信義區光復南路133號',
      city: '台北市',
      area: '信義區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-07.png',
      tags: [BrandType.handmade, BrandType.food],
      organizer: '松菸城市生活企劃',
      transportation: ['捷運：國父紀念館站步行約 10 分鐘', '公車：204、212、278路'],
    },
    {
      title: '桃園親子遊藝市集',
      start_date: '2026/09/19',
      end_date: '2026/09/20',
      infoDate: '2026/08/18',
      description: '結合玩具、繪本與親子體驗課程，讓孩子自由探索，也讓大人慢慢逛。',
      time: '10:00 - 18:00',
      location: '桃園市中壢區 青埔公園',
      address: '桃園市中壢區高鐵南路二段旁',
      city: '桃園市',
      area: '中壢區',
      category: BrandType.family,
      image: 'assets/images/market/cards/market-card-08.png',
      tags: [BrandType.family, BrandType.toy],
      organizer: '桃園親子生活節',
      transportation: ['高鐵：桃園站', '捷運：A18 高鐵桃園站'],
    },
    {
      title: '中央公園夜光手作祭',
      start_date: '2026/10/03',
      end_date: '2026/10/04',
      infoDate: '2026/10/01',
      description: '活動資訊即將公開，將帶來夜間手作、燈飾選物與秋季限定體驗。',
      time: '15:00 - 21:00',
      location: '台中市西屯區 中央公園',
      address: '台中市西屯區中科路2966號',
      city: '台中市',
      area: '西屯區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-09.png',
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '中央公園城市企劃',
      transportation: ['公車：300、301、302路', '開車：中央公園停車場'],
    },
    {
      title: '冬日陶作暖光市集',
      start_date: '2026/11/14',
      end_date: '2026/11/15',
      infoDate: '2026/11/01',
      description: '活動資訊即將公開，預計集結陶作、香氛、織品與暖冬飲品品牌。',
      time: '12:00 - 19:00',
      location: '台北市大同區 迪化街街區',
      address: '台北市大同區迪化街一段周邊',
      city: '台北市',
      area: '大同區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-10.png',
      tags: [BrandType.handmade, BrandType.food],
      organizer: '大稻埕生活選物',
      transportation: ['捷運：北門站步行約 8 分鐘', '公車：9、206、274路'],
    },
  ];

  private readonly historyMarketSamples: HistoryMarketSample[] = [
    {
      title: '小樹市集',
      start_date: '2025/04/12',
      end_date: '2025/04/13',
      time: '10:00 - 18:00',
      location: '台南市安南區 國立臺灣歷史博物館',
      address: '台南市安南區長和路一段250號',
      image: 'assets/images/user/activity/history/history-market-01.png',
      tags: [BrandType.family],
      category: BrandType.family,
      city: '台南市',
      area: '安南區',
      desc: '在歷史與綠意之間，孩子們自在奔跑，大小朋友都能找到喜歡的故事與手作好物。',
      description: '這場市集以親子與戶外生活為主軸，邀請手作品牌、繪本攤位與輕食品牌共同參與，讓參觀博物館的午後多了散步與交流的溫度。',
      organizer: '小樹親子生活節',
      transportation: ['台南火車站轉乘公車至臺灣歷史博物館站', '館區設有汽機車停車場'],
    },
    {
      title: '小火柴文創市集',
      start_date: '2025/05/18',
      end_date: '2025/05/19',
      time: '11:00 - 18:00',
      location: '台南市南區 水交社文化園區',
      address: '台南市南區興中街118號',
      image: 'assets/images/user/activity/history/history-market-02.png',
      tags: [BrandType.handmade],
      category: BrandType.handmade,
      city: '台南市',
      area: '南區',
      desc: '老眷村裡的新故事，文創與手作的溫度，一起感受生活的美好與創意的力量。',
      description: '以眷村文化、插畫紙品與手作飾品為主題，讓創作者與來逛市集的人在園區街角相遇，留下日常裡難得的慢步調。',
      organizer: '小火柴文創企劃',
      transportation: ['台南火車站轉乘市區公車至水交社站', '園區周邊設有公有停車場'],
    },
    {
      title: '舊城午後手作市集',
      start_date: '2025/06/07',
      end_date: '2025/06/08',
      time: '11:00 - 19:00',
      location: '台中市北區 審計新村',
      address: '台中市北區民生路368巷',
      image: 'assets/images/user/activity/history/history-market-03.png',
      tags: [BrandType.handmade],
      category: BrandType.handmade,
      city: '台中市',
      area: '北區',
      desc: '在老屋巷弄中展開的午後市集，聚集陶作、織品、香氛與生活選物品牌。',
      description: '以手作與生活選物為核心，邀請攤主分享創作背後的故事，也讓來訪者在老屋街區裡找到適合自己的日常小物。',
      organizer: '舊城生活策展',
      transportation: ['台中火車站轉乘公車至英才郵局站', '建議搭乘大眾運輸前往'],
    },
    {
      title: '港邊風格服飾市集',
      start_date: '2025/07/12',
      end_date: '2025/07/13',
      time: '14:00 - 20:00',
      location: '高雄市鹽埕區 駁二大義倉庫',
      address: '高雄市鹽埕區大義街2號',
      image: 'assets/images/user/activity/history/history-market-04.png',
      tags: [BrandType.fashion],
      category: BrandType.fashion,
      city: '高雄市',
      area: '鹽埕區',
      desc: '把夏日海風與穿搭靈感放在一起，逛見獨立服飾、配件與風格小物。',
      description: '以服飾配件與風格選物為主題，搭配港邊夕陽與倉庫空間，讓每個攤位都像是一個小小的生活提案。',
      organizer: '港邊風格選物所',
      transportation: ['高雄捷運鹽埕埔站步行約8分鐘', '輕軌駁二大義站下車即可抵達'],
    },
  ];

  get markets(): MarketCardItem[] {
    return this.marketSamples
      .map(withCurrentStatus)
      .filter((market) => market.status !== MarketStatus.ended);
  }

  get historyMarkets(): HistoryMarketCardItem[] {
    return this.historyMarketSamples.map(withEndedStatus);
  }

  get pagedMarkets(): MarketCardItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.markets.slice(startIndex, startIndex + this.pageSize);
  }

  get pagedHistoryMarkets(): HistoryMarketCardItem[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.historyMarkets.slice(startIndex, startIndex + this.pageSize);
  }

  changeTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    this.router.navigate([
      tab === 'history'
        ? '/user/activity-list/history'
        : '/user/activity-list',
    ]);
  }

  changePage(page: number): void {
    this.currentPage = page;
  }

  goToActivityDetail(market: MarketCardItem): void {
    this.router.navigate(['/user/activity-detail'], {
      state: { market },
    });
  }
}
