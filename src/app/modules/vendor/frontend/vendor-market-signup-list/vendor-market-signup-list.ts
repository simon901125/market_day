import { Component } from '@angular/core';
import { VendorHeader } from '../vendor-header/vendor-header';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorMarketCard } from '../vendor-market-card/vendor-market-card';
import { BrandType } from '../../../../models/type/BrandType ';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { MarketCardItem } from '../../../../models/interface/MarketCardItem';
import { VendorMarketSearchPanel } from "../vendor-market-search-panel/vendor-market-search-panel";
import { Router } from '@angular/router';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
@Component({
  selector: 'app-vendor-market-signup-list',
  imports: [VendorHeader, UserFooter, VendorMarketCard, VendorMarketSearchPanel, DashboardPagination],
  templateUrl: './vendor-market-signup-list.html',
  styleUrl: './vendor-market-signup-list.scss',
})
export class VendorMarketSignupList {
  constructor(private router: Router) {}
  keyword = '';
  selectedCity = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 6;
  /** 目前市集列表 */
  markets: MarketCardItem[] = [
    {
      title: '草地野餐市集',
      time: '10:00 - 18:00',
      start_date: '2026/08/17',
      end_date: '2026/08/19',
      description: '在草地上享受美食和音樂，與家人朋友共度美好時光。',
      location: '台中市西區 草悟道',
      address: '台中市西區英才路534號',
      city: '台中市',
      area: '西區',
      image: 'assets/images/market/cards/market-card-01.png',
      status: MarketStatus.active,
      statusClass: 'status-active',
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
      category: '親子家庭',
      organizer: '台中市政府',
      transportation: ['捷運綠線：草悟道站', '公車：5、10、20、30路'],
      price: 600,
      slots: [
        { date: '08/17', remaining: 15 },
        { date: '08/19', remaining: 8 },
      ],
    },
    {
      title: '台北精品咖啡生活節',
      time: '10:00 - 18:00',
      start_date: '2026/08/24',
      end_date: '2026/08/26',
      description: '體驗精品咖啡的香醇與文化，享受慢活的愜意時光。',
      location: '台北市中山區 華山1914文創園區',
      address: '台北市中山區復興南路一段1號',
      city: '台北市',
      area: '中山區',
      image: 'assets/images/market/cards/market-card-02.png',
      status: MarketStatus.active,
      statusClass: 'status-active',
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
      category: '咖啡茶飲',
      organizer: '台北市政府',
      transportation: ['捷運紅線：忠孝新生站', '公車：藍5、藍7、藍10路'],
      price: 600,
      slots: [
        { date: '08/24', remaining: 15 },
        { date: '08/26', remaining: 5 },
      ],
    },
    {
      title: '手作設計市集',
      time: '10:00 - 18:00',
      start_date: '2026/08/31',
      end_date: '2026/09/02',
      description: '匯聚各式手作設計品牌，展現創意與工藝的魅力。',
      location: '台南市中西區 藍晒圖文創園區',
      address: '台南市中西區創意路123號',
      city: '台南市',
      area: '中西區',
      image: 'assets/images/market/cards/market-card-03.png',
      status: MarketStatus.active,
      statusClass: 'status-active',
      tags: [BrandType.handmade, BrandType.fashion, BrandType.toy],
      category: '手作設計',
      organizer: '台南市政府',
      transportation: ['公車：綠幹線、藍幹線', '計程車：台南火車站搭乘約10分鐘'],
      price: 600,
      slots: [
        { date: '08/31', remaining: 6 },
        { date: '09/02', remaining: 1 },
      ],
    },
    {
      title: '山系生活戶外市集',
      time: '10:00 - 18:00',
      start_date: '2026/09/07',
      end_date: '2026/09/09',
      description: '結合戶外活動與生活風格，提供山系愛好者一個交流的平台。',
      location: '新竹市西區 新竹公園',
      address: '新竹市西區公園路123號',
      city: '新竹市',
      area: '西區',
      image: 'assets/images/market/cards/market-card-04.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.fashion, BrandType.family],
      category: '戶外生活',
      organizer: '新竹市政府',
      transportation: ['捷運：新竹站', '公車：綠1、綠2、藍1路'],
      price: 600,
      slots: [
        { date: '09/07', remaining: 13 },
        { date: '09/09', remaining: 11 },
      ],
    },
    {
      title: '毛孩友善市集',
      time: '10:00 - 18:00',
      start_date: '2026/09/14',
      end_date: '2026/09/15',
      description: '專為毛孩和主人打造的友善市集，提供各式寵物用品和活動。',
      location: '高雄市鼓山區 駁二藝術特區',
      address: '高雄市鼓山區駁二藝術特區',
      city: '高雄市',
      area: '鼓山區',
      image: 'assets/images/market/cards/market-card-05.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.pet, BrandType.family],
      category: '寵物',
      organizer: '高雄市政府',
      transportation: ['捷運紅線：鹽埕埔站', '公車：紅1、紅2、藍1路'],
      price: 600,
      slots: [
        { date: '09/14', remaining: 5 },
        { date: '09/15', remaining: 1 },
      ],
    },
    {
      title: '植感生活市集',
      time: '10:00 - 18:00',
      start_date: '2026/09/21',
      end_date: '2026/09/22',
      description: '以植物為主題的生活市集，提供多樣化的植栽和綠色生活用品。',
      location: '台中市北區 審計新村',
      address: '台中市北區育才街99號',
      city: '台中市',
      area: '北區',
      image: 'assets/images/market/cards/market-card-06.png',
      status: MarketStatus.preview,
      statusClass: 'status-preview',
      tags: [BrandType.plant, BrandType.handmade, BrandType.family],
      category: '植物',
      organizer: '台中市政府',
      transportation: ['捷運：台中站', '公車：綠1、綠2、藍1路'],
      price: 600,
      slots: [
        { date: '09/21', remaining: 7 },
        { date: '09/22', remaining: 12 },
      ],
    },
    {
      title: '城市甜點生活市集',
      time: '11:00 - 19:00',
      start_date: '2026/10/05',
      end_date: '2026/10/07',
      description: '集合甜點、咖啡與生活選物，打造週末午後的小旅行。',
      location: '台北市信義區 松山文創園區',
      address: '台北市信義區光復南路133號',
      city: '台北市',
      area: '信義區',
      image: 'assets/images/market/cards/market-card-01.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.food, BrandType.handmade],
      category: '餐飲美食',
      organizer: '台北市政府',
      transportation: ['捷運：國父紀念館站', '公車：204、212、278路'],
      price: 600,
      slots: [
        { date: '10/05', remaining: 16 },
        { date: '10/07', remaining: 9 },
      ],
    },
    {
      title: '親子童趣假日市集',
      time: '10:00 - 18:00',
      start_date: '2026/10/12',
      end_date: '2026/10/14',
      description: '親子手作、童書、玩具與戶外活動，一起度過療癒假日。',
      location: '桃園市中壢區 青埔公園',
      address: '桃園市中壢區高鐵南路二段',
      city: '桃園市',
      area: '中壢區',
      image: 'assets/images/market/cards/market-card-02.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.family, BrandType.toy],
      category: '親子家庭',
      organizer: '桃園市政府',
      transportation: ['高鐵：桃園站', '捷運：A18 高鐵桃園站'],
      price: 600,
      slots: [
        { date: '10/12', remaining: 15 },
        { date: '10/14', remaining: 15 },
      ],
    },
    {
      title: '夏夜音樂手作市集',
      time: '15:00 - 21:00',
      start_date: '2026/10/19',
      end_date: '2026/10/21',
      description: '結合音樂表演與手作品牌，打造夏夜限定市集體驗。',
      location: '台中市西屯區 中央公園',
      address: '台中市西屯區經貿五路',
      city: '台中市',
      area: '西屯區',
      image: 'assets/images/market/cards/market-card-03.png',
      status: MarketStatus.preview,
      statusClass: 'status-preview',
      tags: [BrandType.handmade, BrandType.fashion],
      category: '文創手作',
      organizer: '台中市政府',
      transportation: ['公車：300、301、302路', '自行開車：中央公園停車場'],
      price: 600,
      slots: [
        { date: '10/19', remaining: 5 },
        { date: '10/21', remaining: 6 },
      ],
    },
    {
      title: '港邊海風選物市集',
      time: '12:00 - 20:00',
      start_date: '2026/11/02',
      end_date: '2026/11/04',
      description: '在港邊吹著海風，探索在地品牌與生活風格選物。',
      location: '高雄市鹽埕區 駁二藝術特區',
      address: '高雄市鹽埕區大勇路1號',
      city: '高雄市',
      area: '鹽埕區',
      image: 'assets/images/market/cards/market-card-04.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.fashion, BrandType.handmade],
      category: '生活風格',
      organizer: '高雄市政府',
      transportation: ['捷運：鹽埕埔站', '輕軌：駁二大義站'],
      price: 600,
      slots: [
        { date: '11/02', remaining: 15 },
        { date: '11/04', remaining: 8 },
      ],
    },
    {
      title: '植物療癒週末市集',
      time: '10:00 - 18:00',
      start_date: '2026/11/10',
      end_date: '2026/11/11',
      description: '植栽、香氛與居家選物，讓生活多一點綠意。',
      location: '台南市東區 巴克禮公園',
      address: '台南市東區中華東路三段',
      city: '台南市',
      area: '東區',
      image: 'assets/images/market/cards/market-card-05.png',
      status: MarketStatus.preview,
      statusClass: 'status-preview',
      tags: [BrandType.plant, BrandType.handmade],
      category: '植物選物',
      organizer: '台南市政府',
      transportation: ['公車：紅3、藍幹線', '自行開車：周邊停車場'],
      price: 600,
      slots: [
        { date: '11/10', remaining: 15 },
        { date: '11/11', remaining: 15 },
      ],
    },
    {
      title: '毛孩夏日派對市集',
      time: '10:00 - 18:00',
      start_date: '2026/08/17',
      end_date: '2026/08/18',
      description: '寵物友善品牌、毛孩用品與互動體驗一次集合。',
      location: '新北市板橋區 新板萬坪公園',
      address: '新北市板橋區新府路',
      city: '新北市',
      area: '板橋區',
      image: 'assets/images/market/cards/market-card-06.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.pet, BrandType.family],
      category: '寵物生活',
      organizer: '新北市政府',
      transportation: ['捷運：板橋站', '台鐵：板橋站'],
      price: 600,
      slots: [
        { date: '08/17', remaining: 15 },
        { date: '08/18', remaining: 15 },
      ],
    },
    {
      title: '秋日職人手作市集',
      time: '10:00 - 18:00',
      start_date: '2026/09/06',
      end_date: '2026/09/08',
      description: '職人品牌、手作工藝與秋季選物，感受創作的溫度。',
      location: '台北市大同區 迪化街商圈',
      address: '台北市大同區迪化街一段',
      city: '台北市',
      area: '大同區',
      image: 'assets/images/market/cards/market-card-01.png',
      status: MarketStatus.preview,
      statusClass: 'status-preview',
      tags: [BrandType.handmade, BrandType.fashion],
      category: '文創手作',
      organizer: '台北市政府',
      transportation: ['捷運：北門站', '公車：9、206、274路'],
      price: 600,
      slots: [
        { date: '09/06', remaining: 15 },
        { date: '09/08', remaining: 15 },
      ],
    },
    {
      title: '老屋生活風格市集',
      time: '11:00 - 19:00',
      start_date: '2026/09/14',
      end_date: '2026/09/15',
      description: '在老屋街區裡探索選物、咖啡、手作與生活風格。',
      location: '台中市西區 審計新村',
      address: '台中市西區民生路368巷',
      city: '台中市',
      area: '西區',
      image: 'assets/images/market/cards/market-card-02.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
      category: '生活風格',
      organizer: '台中市政府',
      transportation: ['公車：11、27、51路', '自行開車：周邊停車場'],
      price: 600,
      slots: [
        { date: '09/14', remaining: 15 },
        { date: '09/15', remaining: 15 },
      ],
    },
    {
      title: '玩具收藏交流市集',
      time: '10:00 - 18:00',
      start_date: '2026/09/21',
      end_date: '2026/09/22',
      description: '玩具收藏、模型、插畫與親子互動體驗。',
      location: '台北市中正區 華山1914文創園區',
      address: '台北市中正區八德路一段1號',
      city: '台北市',
      area: '中正區',
      image: 'assets/images/market/cards/market-card-03.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.toy, BrandType.family],
      category: '玩具選物',
      organizer: '台北市政府',
      transportation: ['捷運：忠孝新生站', '公車：669、672路'],
      price: 600,
      slots: [
        { date: '09/21', remaining: 15 },
        { date: '09/22', remaining: 8 },
      ],
    },
    {
      title: '花草香氛生活市集',
      time: '10:00 - 18:00',
      start_date: '2026/10/05',
      end_date: '2026/10/06',
      description: '花藝、植栽、香氛與自然系生活品牌集合。',
      location: '宜蘭縣冬山鄉 冬山河親水公園',
      address: '宜蘭縣冬山鄉協和路20之36號',
      city: '宜蘭縣',
      area: '冬山鄉',
      image: 'assets/images/market/cards/market-card-04.png',
      status: MarketStatus.preview,
      statusClass: 'status-preview',
      tags: [BrandType.plant, BrandType.handmade],
      category: '植物選物',
      organizer: '宜蘭縣政府',
      transportation: ['台鐵：羅東站', '公車：綠21、綠25路'],
      price: 600,
      slots: [
        { date: '10/05', remaining: 15 },
        { date: '10/06', remaining: 15 },
      ],
    },
    {
      title: '街角咖啡甜點市集',
      time: '11:00 - 19:00',
      start_date: '2026/10/12',
      end_date: '2026/10/13',
      description: '城市街角的咖啡與甜點品牌，讓週末變得更輕鬆。',
      location: '新竹市東區 東門市場',
      address: '新竹市東區大同路86號',
      city: '新竹市',
      area: '東區',
      image: 'assets/images/market/cards/market-card-05.png',
      status: MarketStatus.upcoming,
      statusClass: 'status-upcoming',
      tags: [BrandType.food, BrandType.handmade],
      category: '餐飲美食',
      organizer: '新竹市政府',
      transportation: ['台鐵：新竹站', '步行約10分鐘'],
      price: 600,
      slots: [
        { date: '10/12', remaining: 11 },
        { date: '10/13', remaining: 17 },
      ],
    },
    {
      title: '冬日禮物選品市集',
      time: '10:00 - 20:00',
      start_date: '2026/12/14',
      end_date: '2026/12/15',
      description: '年末禮物、手作飾品、生活選物與節慶限定品牌。',
      location: '台北市信義區 香堤大道',
      address: '台北市信義區松壽路',
      city: '台北市',
      area: '信義區',
      image: 'assets/images/market/cards/market-card-06.png',
      status: MarketStatus.preview,
      statusClass: 'status-preview',
      tags: [BrandType.fashion, BrandType.handmade],
      category: '服飾配件',
      organizer: '台北市政府',
      transportation: ['捷運：台北101/世貿站', '捷運：市政府站'],
      price: 600,
      slots: [
        { date: '12/14', remaining: 15 },
        { date: '12/15', remaining: 10 },
      ],
    },
  ];

  //這個之後會改成API
  get filteredMarkets(): MarketCardItem[] {
    return this.markets.filter((market) => {
      const keyword = this.keyword.trim();
      const matchKeyword = !keyword || market.title.includes(keyword) || market.category.includes(keyword) || market.city.includes(keyword);
      const matchCity = !this.selectedCity || market.city === this.selectedCity;
      const matchStatus = !this.selectedStatus || market.status === this.selectedStatus;
      return matchKeyword && matchCity && matchStatus;
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredMarkets.length / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  get pagedMarkets(): MarketCardItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMarkets.slice(start, start + this.pageSize);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
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

  /**
   * 導航到市集報名詳情頁
   * @param market 選擇的市集
   */
  goToSignUpDetail(market: MarketCardItem): void {
    this.router.navigate(['/vendor/sign-up-detail'], {
      state: { market },
    });
  }
}
