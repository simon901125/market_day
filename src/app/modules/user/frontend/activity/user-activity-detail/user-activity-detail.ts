import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MarketCardItem } from '../../../../../models/interface/shared/MarketCardItem';
import { TrafficItem } from '../../../../../models/interface/user/TrafficItem';
import { MarketStatus } from '../../../../../models/status/MarketStatus';
import { BrandType } from '../../../../../models/type/BrandType ';

const DAY_MS = 1000 * 60 * 60 * 24;

/** 依活動日期計算前台顯示狀態：8 天以上為活動預告，7 天內為即將開始。 */
const withStatus = (market: Omit<MarketCardItem, 'status' | 'statusClass'>): MarketCardItem => {
  const today = new Date();
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [startYear, startMonth, startDay] = market.start_date.split('/').map(Number);
  const [endYear, endMonth, endDay] = market.end_date.split('/').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const daysUntilStart = Math.ceil((start.getTime() - current.getTime()) / DAY_MS);

  const status = current > end
    ? MarketStatus.ended
    : current >= start && current <= end
      ? MarketStatus.active
      : daysUntilStart <= 7
        ? MarketStatus.upcoming
        : MarketStatus.preview;

  return {
    ...market,
    status,
    statusClass: MarketStatus.getClass(status),
  };
};

@Component({
  selector: 'app-user-activity-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-activity-detail.html',
  styleUrl: './user-activity-detail.scss',
})
/** 一般使用者活動詳情頁，依 marketId 或導頁 state 顯示活動完整內容。 */
export class UserActivityDetail {
  /** 目前顯示的活動資料。 */
  market: MarketCardItem | null = null;

  /** 詳情頁 fallback 資料；API 串接前用於支援重新整理還原內容。 */
  readonly fallbackMarkets: MarketCardItem[] = [
    withStatus({
      id: 'market-2026-summer-green',
      title: '夏日綠意市集',
      start_date: '2026/06/15',
      end_date: '2026/06/21',
      infoDate: '2026/05/20',
      description: '結合手作選物、風格餐飲與親子互動體驗，打造適合週末散步與逛市集的城市綠意空間。',
      time: '10:00 - 18:00',
      location: '台北市 信義區 草悟廣場',
      address: '台北市信義區松高路 11 號',
      city: '台北市',
      area: '信義區',
      category: BrandType.family,
      image: 'assets/images/market/cards/market-card-01.png',
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
      organizer: '小集日企劃團隊',
      transportation: ['捷運市政府站步行約 8 分鐘', '公車市政府站下車', '周邊設有付費停車場'],
    }),
    withStatus({
      id: 'market-2026-urban-craft',
      title: '職人咖啡生活市集',
      start_date: '2026/06/27',
      end_date: '2026/06/28',
      infoDate: '2026/05/28',
      description: '集合手沖咖啡、甜點與生活選物攤位，在樹蔭下慢慢品味週末午後。',
      time: '11:00 - 19:00',
      location: '台北市 中正區 華山文創園區',
      address: '台北市中正區八德路一段 1 號',
      city: '台北市',
      area: '中正區',
      category: BrandType.food,
      image: 'assets/images/market/cards/market-card-02.png',
      tags: [BrandType.food, BrandType.handmade],
      organizer: '咖啡日和企劃',
      transportation: ['捷運忠孝新生站步行約 5 分鐘', '公車華山文創園區站下車'],
    }),
    withStatus({
      id: 'market-2026-food-picnic',
      title: '衣著選物週末',
      start_date: '2026/07/04',
      end_date: '2026/07/05',
      infoDate: '2026/06/05',
      description: '以服飾、包袋與日常配件為主題，帶來清爽自然的夏季穿搭靈感。',
      time: '10:30 - 18:30',
      location: '新北市 板橋區 新板萬坪公園',
      address: '新北市板橋區新府路 1 號',
      city: '新北市',
      area: '板橋區',
      category: BrandType.fashion,
      image: 'assets/images/market/cards/market-card-03.png',
      tags: [BrandType.fashion, BrandType.handmade],
      organizer: '日常衣著企劃',
      transportation: ['捷運板橋站步行約 7 分鐘', '板橋公車站下車後步行可達'],
    }),
    withStatus({
      id: 'market-2026-style-select',
      title: '風格選物生活節',
      start_date: '2026/07/18',
      end_date: '2026/07/19',
      infoDate: '2026/06/18',
      description: '以日常選物、服飾配件、香氛與風格家飾為主題的週末市集。',
      time: '10:00 - 18:00',
      location: '台中市 西區 勤美草悟道',
      address: '台中市西區公益路 68 號',
      city: '台中市',
      area: '西區',
      category: BrandType.fashion,
      image: 'assets/images/market/cards/market-card-04.png',
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '草悟風格企劃',
      transportation: ['公車科博館站下車', '假日建議搭乘大眾運輸'],
    }),
    withStatus({
      id: 'market-2026-pet-day',
      title: '毛孩友善市集',
      start_date: '2026/08/01',
      end_date: '2026/08/02',
      infoDate: '2026/07/01',
      description: '寵物用品、手作零食、毛孩攝影與戶外互動體驗一次集合。',
      time: '15:00 - 21:00',
      location: '高雄市 鹽埕區 駁二藝術特區',
      address: '高雄市鹽埕區大勇路 1 號',
      city: '高雄市',
      area: '鹽埕區',
      category: BrandType.pet,
      image: 'assets/images/market/cards/market-card-05.png',
      tags: [BrandType.pet, BrandType.family],
      organizer: '毛日子生活市集',
      transportation: ['捷運鹽埕埔站步行約 8 分鐘', '輕軌駁二大義站下車即達'],
    }),
    withStatus({
      id: 'market-2026-plant-living',
      title: '植感生活市集',
      start_date: '2026/08/15',
      end_date: '2026/08/16',
      infoDate: '2026/07/20',
      description: '以植物、花藝、盆器與自然系選物為主題，替生活補上一點綠。',
      time: '10:00 - 18:00',
      location: '桃園市 中壢區 青塘園',
      address: '桃園市中壢區高鐵南路二段',
      city: '桃園市',
      area: '中壢區',
      category: BrandType.plant,
      image: 'assets/images/market/cards/market-card-06.png',
      tags: [BrandType.plant, BrandType.handmade],
      organizer: '植感企劃所',
      transportation: ['高鐵桃園站步行約 10 分鐘', '機場捷運 A18 高鐵桃園站'],
    }),
    withStatus({
      id: 'market-2026-bakery-craft',
      title: '烘焙陶作午後市集',
      start_date: '2026/09/05',
      end_date: '2026/09/06',
      infoDate: '2026/08/01',
      description: '手作麵包、陶器杯盤與餐桌選物一起登場，適合慢慢逛、慢慢挑。',
      time: '13:00 - 19:00',
      location: '台南市 中西區 河樂廣場',
      address: '台南市中西區中正路 343-20 號',
      city: '台南市',
      area: '中西區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-07.png',
      tags: [BrandType.food, BrandType.handmade],
      organizer: '餐桌日常企劃',
      transportation: ['公車河樂廣場站下車', '從海安路商圈步行約 5 分鐘'],
    }),
    withStatus({
      id: 'market-2026-family-craft',
      title: '草地親子手作日',
      start_date: '2026/09/19',
      end_date: '2026/09/20',
      infoDate: '2026/08/18',
      description: '親子野餐、手作體驗與木質玩具攤位，讓孩子和大人都能輕鬆參與。',
      time: '10:00 - 18:00',
      location: '新竹市 東區 關新公園',
      address: '新竹市東區關新路 21 號',
      city: '新竹市',
      area: '東區',
      category: BrandType.family,
      image: 'assets/images/market/cards/market-card-08.png',
      tags: [BrandType.family, BrandType.toy, BrandType.handmade],
      organizer: '親子日常企劃',
      transportation: ['公車關新公園站下車', '周邊設有收費停車場'],
    }),
    withStatus({
      id: 'market-2026-night-craft',
      title: '月光手作夜市集',
      start_date: '2026/10/03',
      end_date: '2026/10/04',
      infoDate: '2026/09/01',
      description: '夜晚燈串下的手作攤位、香氛選物與輕食品牌，適合秋夜散步。',
      time: '16:00 - 21:00',
      location: '台中市 西屯區 中央公園',
      address: '台中市西屯區中科路 2966 號',
      city: '台中市',
      area: '西屯區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-09.png',
      tags: [BrandType.handmade, BrandType.food],
      organizer: '月光市集製作所',
      transportation: ['公車中央公園站下車', '捷運文華高中站轉乘公車可達'],
    }),
    withStatus({
      id: 'market-2026-harbor-weaving',
      title: '海風編織選物市集',
      start_date: '2026/11/14',
      end_date: '2026/11/15',
      infoDate: '2026/10/15',
      description: '海邊夕陽、編織包袋、藤編家飾與度假風選物，替冬日前補上一點暖光。',
      time: '12:00 - 19:00',
      location: '基隆市 中正區 正濱漁港',
      address: '基隆市中正區正濱路 72 號',
      city: '基隆市',
      area: '中正區',
      category: BrandType.handmade,
      image: 'assets/images/market/cards/market-card-10.png',
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '海風選物企劃',
      transportation: ['公車正濱漁港站下車', '從基隆車站轉乘公車約 15 分鐘'],
    }),
    {
      id: 'history-2025-spring',
      title: '春日野餐市集',
      start_date: '2025/04/12',
      end_date: '2025/04/13',
      description: '以草地野餐、親子互動與輕食甜點為主題，吸引許多家庭一起參與。',
      time: '10:00 - 18:00',
      location: '台北市 大安區 大安森林公園',
      address: '台北市大安區新生南路二段 1 號',
      city: '台北市',
      area: '大安區',
      category: BrandType.family,
      image: 'assets/images/market/history/history-market-01.png',
      status: MarketStatus.ended,
      statusClass: MarketStatus.getClass(MarketStatus.ended),
      tags: [BrandType.family],
      organizer: '春日生活企劃',
      transportation: ['捷運大安森林公園站出站即達', '多線公車可抵達大安森林公園'],
    },
    {
      id: 'history-2025-craft',
      title: '手感工藝生活節',
      start_date: '2025/05/18',
      end_date: '2025/05/19',
      description: '邀請陶藝、皮革、布作與插畫品牌，呈現手作與日常生活的溫度。',
      time: '11:00 - 18:00',
      location: '台中市 西區 審計新村',
      address: '台中市西區民生路 368 巷',
      city: '台中市',
      area: '西區',
      category: BrandType.handmade,
      image: 'assets/images/market/history/history-market-02.png',
      status: MarketStatus.ended,
      statusClass: MarketStatus.getClass(MarketStatus.ended),
      tags: [BrandType.handmade],
      organizer: '手感生活團隊',
      transportation: ['公車審計新村站下車', '從草悟道商圈步行約 10 分鐘'],
    },
    {
      id: 'history-2025-alley-green',
      title: '老街綠意選物市集',
      start_date: '2025/06/07',
      end_date: '2025/06/08',
      description: '以植栽、藤編家飾與自然系生活小物為主題，讓老街午後多了一點綠意與慢步調。',
      time: '11:00 - 19:00',
      location: '台南市 中西區 蝸牛巷',
      address: '台南市中西區永福路二段周邊',
      city: '台南市',
      area: '中西區',
      category: BrandType.plant,
      image: 'assets/images/market/history/history-market-03.png',
      status: MarketStatus.ended,
      statusClass: MarketStatus.getClass(MarketStatus.ended),
      tags: [BrandType.plant, BrandType.handmade],
      organizer: '老街生活企劃',
      transportation: ['台南火車站轉乘公車至赤崁樓站', '步行可串連周邊街區'],
    },
    {
      id: 'history-2025-harbor-craft',
      title: '港邊手作假日',
      start_date: '2025/07/12',
      end_date: '2025/07/13',
      description: '集合飾品、插畫、編織與海風感選物，讓逛市集也像一趟靠海的小旅行。',
      time: '14:00 - 20:00',
      location: '高雄市 鼓山區 棧貳庫',
      address: '高雄市鼓山區蓬萊路 17 號',
      city: '高雄市',
      area: '鼓山區',
      category: BrandType.handmade,
      image: 'assets/images/market/history/history-market-04.png',
      status: MarketStatus.ended,
      statusClass: MarketStatus.getClass(MarketStatus.ended),
      tags: [BrandType.handmade, BrandType.fashion],
      organizer: '港邊風格選物所',
      transportation: ['輕軌駁二蓬萊站步行約 5 分鐘', '捷運西子灣站步行約 10 分鐘'],
    },
  ];

  /** 先讀導頁 state，沒有 state 時改用 query param 的 marketId 找 fallback 資料。 */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const navigation = this.router.currentNavigation();
    const stateMarket = navigation?.extras.state?.['market'] || history.state?.['market'];
    const marketId = this.route.snapshot.queryParamMap.get('marketId') ?? stateMarket?.id;

    this.market = stateMarket ?? this.fallbackMarkets.find((market) => market.id === marketId) ?? this.fallbackMarkets[0];
  }

  /** 將活動交通資訊轉成畫面可迭代的 icon/label/text 結構。 */
  get trafficItems(): TrafficItem[] {
    return (this.market?.transportation ?? []).map((text, index) => ({
      icon: ['bi bi-train-front', 'bi bi-bus-front', 'bi bi-car-front-fill'][index] ?? 'bi bi-geo-alt',
      label: ['捷運', '公車', '開車'][index] ?? '交通',
      text,
    }));
  }

  /** 是否顯示攤位地圖與品牌攤位資訊。 */
  get showBoothInfo(): boolean {
    return this.market?.status !== MarketStatus.preview;
  }

  /** 活動預告狀態時顯示提示 Banner。 */
  get showAnnouncement(): boolean {
    return !this.showBoothInfo;
  }

  /** 活動補充介紹文字。 */
  get activityIntroExtra(): string {
    return '現場將安排品牌攤位、休憩座位與導覽標示，方便使用者依照喜好探索不同區域。實際攤位與活動內容以主辦方公告為準。';
  }

  /** 主辦單位名稱，缺值時使用預設文字。 */
  get organizerName(): string {
    return this.market?.organizer ?? '小集日企劃團隊';
  }

  /** Breadcrumb 第二層標籤依活動是否結束切換。 */
  get breadcrumbSectionLabel(): string {
    return this.market?.status === MarketStatus.ended ? '歷史活動' : '近期活動';
  }

  /** Breadcrumb 第二層連結依活動是否結束切換。 */
  get breadcrumbSectionLink(): string {
    return this.market?.status === MarketStatus.ended
      ? '/user/activity-list/history'
      : '/user/activity-list';
  }

  /** 是否隱藏攤位資訊區塊。 */
  openMarketInfo(): boolean {
    return !this.showBoothInfo;
  }

  /** 計算距離活動開始還有幾天。 */
  countMarketDays(startDate: string): number {
    if (!startDate) {
      return 0;
    }

    const today = this.todayStart();
    const start = this.parseDate(startDate);
    return Math.max(0, Math.ceil((start.getTime() - today.getTime()) / DAY_MS));
  }

  /** 依活動日期回傳倒數或狀態文字。 */
  marketDaysText(startDate: string, endDate = this.market?.end_date ?? ''): string {
    if (!startDate) {
      return '';
    }

    const today = this.todayStart();
    const start = this.parseDate(startDate);
    const end = endDate ? this.parseDate(endDate) : start;

    if (today > end) {
      return '活動已結束';
    }

    if (today >= start && today <= end) {
      return '活動進行中';
    }

    return '距離活動開始還有';
  }

  /** 將 YYYY/MM/DD 字串轉成 Date。 */
  private parseDate(value: string): Date {
    const [year, month, day] = value.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  /** 取得今天 00:00，用於日期比較。 */
  private todayStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
