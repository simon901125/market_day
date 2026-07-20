import { Component, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MarketCardItem } from '../../../../../models/interface/shared/MarketCardItem';
import { HistoryMarketCardItem } from '../../../../../models/interface/user/HistoryMarketCardItem';
import { BrandType } from '../../../../../models/type/BrandType ';
import { MarketStatus } from '../../../../../models/status/MarketStatus';
import { UserMarketCardApi } from '../../../../../models/interface/user/UserPublicApi';
import { AlertService } from '../../../../../core/services/alert.service';

import {
  UserMarketSearchPanel,
  UserMarketSearchParams as UserMarketPanelSearchParams,
} from '../../shared/user-market-search-panel/user-market-search-panel';
import { Pagination } from '../../../../shared/pagination/pagination';
import { UserMarketCard } from '../../shared/user-market-card/user-market-card';
import { UserHistoryMarketCard } from '../../shared/user-history-market-card/user-history-market-card';
import { UserMarketApiService } from '../../../services/user-market-api.service';

type MarketSample = Omit<MarketCardItem, 'status' | 'statusClass'> &
  Partial<Pick<MarketCardItem, 'status'>>;
type HistoryMarketSample = Omit<HistoryMarketCardItem, 'status' | 'statusClass'>;

/** 補上狀態樣式；活動狀態以資料來源為準。 */
const withCurrentStatus = (market: MarketSample): MarketCardItem => {
  const status = market.status ?? MarketStatus.upcoming;
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

const formatApiDate = (value: string | null | undefined): string =>
  value ? value.replace(/-/g, '/') : '';

const categoryNames = (market: UserMarketCardApi): string[] =>
  (market.categories ?? []).map((category) => category.name).filter(Boolean);

const mapMarketCard = (market: UserMarketCardApi): MarketCardItem => {
  const status = market.eventStatus || MarketStatus.upcoming;
  const startDate = formatApiDate(market.startDate);
  const endDate = formatApiDate(market.endDate);

  return {
    id: String(market.id),
    title: market.title,
    start_date: startDate,
    end_date: endDate,
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
  imports: [
    UserMarketSearchPanel,
    UserMarketCard,
    UserHistoryMarketCard,
    Pagination,
  ],
  templateUrl: './user-activity-list.html',
  styleUrl: './user-activity-list.scss',
})
/** 一般使用者活動列表頁，管理目前活動/歷史活動分頁與搜尋條件 URL 狀態。 */
export class UserActivityList {
  private readonly destroyRef = inject(DestroyRef);

  /** 目前分頁：近期活動或歷史活動。 */
  activeTab: 'current' | 'history' = 'current';
  /** 目前頁碼，會同步到 query params。 */
  currentPage = 1;
  /** 每頁顯示筆數。 */
  pageSize = 6;

  /** 搜尋關鍵字。 */
  keyword = '';
  /** 搜尋縣市。 */
  selectedCity = '';
  /** 搜尋活動狀態。 */
  selectedStatus = '';
  /** 搜尋活動分類。 */
  selectedCategory = '';
  /** 搜尋日期起日。 */
  startDate = '';
  /** 搜尋日期迄日。 */
  endDate = '';

  /** 目前活動假資料；之後可改由 API 回傳。 */
  private readonly marketSamples: MarketSample[] = [
    {
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
    },
    {
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
      transportation: [
        '捷運忠孝新生站步行約 5 分鐘',
        '公車華山文創園區站下車',
        '可停華山文創園區停車場',
      ],
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
  ];

  /** 歷史活動假資料；之後可改由 API 回傳。 */
  private readonly historyMarketSamples: HistoryMarketSample[] = [
    {
      id: 'history-2025-spring',
      title: '春日野餐市集',
      start_date: '2025/04/12',
      end_date: '2025/04/13',
      time: '10:00 - 18:00',
      location: '台北市 大安區 大安森林公園',
      address: '台北市大安區新生南路二段 1 號',
      image: 'assets/images/market/history/history-market-01.png',
      tags: [BrandType.family],
      category: BrandType.family,
      city: '台北市',
      area: '大安區',
      desc: '春季戶外野餐與手作選物活動。',
      description: '以草地野餐、親子互動與輕食甜點為主題，吸引許多家庭一起參與。',
      organizer: '春日生活企劃',
      transportation: ['捷運大安森林公園站出站即達', '多線公車可抵達大安森林公園'],
    },
    {
      id: 'history-2025-craft',
      title: '手感工藝生活節',
      start_date: '2025/05/18',
      end_date: '2025/05/19',
      time: '11:00 - 18:00',
      location: '台中市 西區 審計新村',
      address: '台中市西區民生路 368 巷',
      image: 'assets/images/market/history/history-market-02.png',
      tags: [BrandType.handmade],
      category: BrandType.handmade,
      city: '台中市',
      area: '西區',
      desc: '聚焦手作品牌與生活工藝。',
      description: '邀請陶藝、皮革、布作與插畫品牌，呈現手作與日常生活的溫度。',
      organizer: '手感生活團隊',
      transportation: ['公車審計新村站下車', '從草悟道商圈步行約 10 分鐘'],
    },
    {
      id: 'history-2025-alley-green',
      title: '老街綠意選物市集',
      start_date: '2025/06/07',
      end_date: '2025/06/08',
      time: '11:00 - 19:00',
      location: '台南市 中西區 蝸牛巷',
      address: '台南市中西區永福路二段周邊',
      image: 'assets/images/market/history/history-market-03.png',
      tags: [BrandType.plant, BrandType.handmade],
      category: BrandType.plant,
      city: '台南市',
      area: '中西區',
      desc: '老街巷弄中的植栽與藤編選物活動。',
      description: '以植栽、藤編家飾與自然系生活小物為主題，讓老街午後多了一點綠意與慢步調。',
      organizer: '老街生活企劃',
      transportation: ['台南火車站轉乘公車至赤崁樓站', '步行可串連周邊街區'],
    },
    {
      id: 'history-2025-harbor-craft',
      title: '港邊手作假日',
      start_date: '2025/07/12',
      end_date: '2025/07/13',
      time: '14:00 - 20:00',
      location: '高雄市 鼓山區 棧貳庫',
      address: '高雄市鼓山區蓬萊路 17 號',
      image: 'assets/images/market/history/history-market-04.png',
      tags: [BrandType.handmade, BrandType.fashion],
      category: BrandType.handmade,
      city: '高雄市',
      area: '鼓山區',
      desc: '港邊倉庫旁的手作與風格選物活動。',
      description: '集合飾品、插畫、編織與海風感選物，讓逛市集也像一趟靠海的小旅行。',
      organizer: '港邊風格選物所',
      transportation: ['輕軌駁二蓬萊站步行約 5 分鐘', '捷運西子灣站步行約 10 分鐘'],
    },
  ];

  private apiMarkets: MarketCardItem[] = [];
  private apiHistoryMarkets: HistoryMarketCardItem[] = [];
  private marketTotal = 0;
  private historyMarketTotal = 0;
  private currentLoadedFromApi = false;
  private historyLoadedFromApi = false;

  /** 依照目前路由與 query params 初始化頁籤、頁碼與搜尋條件。 */
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

  /** 套用前端狀態後的目前活動列表。 */
  get markets(): MarketCardItem[] {
    if (this.currentLoadedFromApi) {
      return this.apiMarkets;
    }

    return this.marketSamples.map(withCurrentStatus);
  }

  /** 套用已結束狀態後的歷史活動列表。 */
  get historyMarkets(): HistoryMarketCardItem[] {
    if (this.historyLoadedFromApi) {
      return this.apiHistoryMarkets;
    }

    return this.historyMarketSamples.map(withEndedStatus);
  }

  /** 目前頁碼要顯示的活動卡片。 */
  get pagedMarkets(): MarketCardItem[] {
    if (this.currentLoadedFromApi) {
      return this.markets;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.markets.slice(startIndex, startIndex + this.pageSize);
  }

  /** 目前頁碼要顯示的歷史活動卡片。 */
  get pagedHistoryMarkets(): HistoryMarketCardItem[] {
    if (this.historyLoadedFromApi) {
      return this.historyMarkets;
    }

    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.historyMarkets.slice(startIndex, startIndex + this.pageSize);
  }

  get totalItems(): number {
    if (this.activeTab === 'history') {
      return this.historyLoadedFromApi ? this.historyMarketTotal : this.historyMarkets.length;
    }

    return this.currentLoadedFromApi ? this.marketTotal : this.markets.length;
  }

  /** 切換目前/歷史活動分頁，並保留搜尋條件。 */
  changeTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
    this.currentPage = 1;
    void this.router.navigate([
      tab === 'history' ? '/user/activity-list/history' : '/user/activity-list',
    ], {
      queryParams: this.currentQueryParams(1),
    });
  }

  /** 切換分頁頁碼並同步到 URL。 */
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

  /** 前往活動詳情，透過 marketId 支援重新整理還原資料。 */
  goToActivityDetail(market: MarketCardItem): void {
    this.router.navigate(['/user/activity-detail'], {
      queryParams: { marketId: market.id },
      state: { market },
    });
  }

  /** 組合目前列表 URL 需要保存的 query params。 */
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
    this.marketApi.searchMarkets({
      eventType: this.activeTab === 'history' ? '歷史活動' : '目前活動',
      keyword: this.keyword,
      city: this.selectedCity,
      eventStatus: this.selectedStatus,
      categoryNames: this.selectedCategory,
      startDate: this.startDate,
      endDate: this.endDate,
      page: this.currentPage,
      pageSize: this.pageSize,
    }).subscribe({
      next: async (res) => {
        if (res.statusCode !== 200) {
          await this.alert.error('查詢市集失敗', res.message || '請稍後再試。');
          return;
        }

        if (this.activeTab === 'history') {
          this.apiHistoryMarkets = res.data.items.map(mapHistoryMarketCard);
          this.historyMarketTotal = res.data.totalItems;
          this.historyLoadedFromApi = true;
          return;
        }

        this.apiMarkets = res.data.items.map(mapMarketCard);
        this.marketTotal = res.data.totalItems;
        this.currentLoadedFromApi = true;
      },
      error: async (error) => {
        await this.alert.error(
          '查詢市集失敗',
          error.error?.message || '請確認後端服務是否啟動。'
        );
      },
    });
  }
}
