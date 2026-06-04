import { Component } from '@angular/core';
import { MarketCardItem } from '../../../models/MarketCardItem';
import { UserMarketSearchPanel } from '../user-market-search-panel/user-market-search-panel';
import { UserMarketCard } from '../user-market-card/user-market-card';
import { UserHistoryMarketCard } from '../user-history-market-card/user-history-market-card';
import { HistoryMarketCardItem } from '../../../models/HistoryMarketCardItem';
import { BrandType } from '../../../models/BrandType ';
import { MarketStatus } from '../../../models/MarketStatus ';
import { Router} from '@angular/router';
@Component({
  selector: 'app-user-activity-list',
  imports: [UserMarketSearchPanel, UserMarketCard,UserHistoryMarketCard],
  templateUrl: './user-activity-list.html',
  styleUrl: './user-activity-list.scss',
})
export class UserActivityList {

  constructor(private router: Router) {}
  /** 目前所在的標籤 */
  activeTab: 'current' | 'history' = 'current';
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
      image: 'assets/images/user/market-card-01.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
      organizer: '台中市政府',
      Transportation: ['捷運綠線：草悟道站', '公車：5、10、20、30路']
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
      image: 'assets/images/user/market-card-02.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
      organizer: '台北市政府',
      Transportation: ['捷運紅線：忠孝新生站', '公車：藍5、藍7、藍10路']
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
      image: 'assets/images/user/market-card-03.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.handmade, BrandType.fashion, BrandType.toy],
      organizer: '台南市政府',
      Transportation: ['公車：綠幹線、藍幹線', '計程車：台南火車站搭乘約10分鐘']
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
      image: 'assets/images/user/market-card-04.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.fashion, BrandType.family],
      organizer: '新竹市政府',
      Transportation: ['捷運：新竹站', '公車：綠1、綠2、藍1路']
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
      image: 'assets/images/user/market-card-05.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.pet, BrandType.family],
      organizer: '高雄市政府',
      Transportation: ['捷運紅線：鹽埕埔站', '公車：紅1、紅2、藍1路']
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
      image: 'assets/images/user/market-card-06.png',
      status: MarketStatus.preview,
      statusClass: MarketStatus.getClass(MarketStatus.preview),
      tags: [BrandType.plant, BrandType.handmade, BrandType.family],
      organizer: '台中市政府',
      Transportation: ['捷運：台中站', '公車：綠1、綠2、藍1路']
    },
  ];

  /** 歷史市集列表 */
  historyMarkets: HistoryMarketCardItem[] = [
  {
    title: '小樹市集｜台灣歷史博物館戶外廣場',
    start_date: '2024/06/15',
    end_date: '2024/06/16',
    location: '台南市 安南區',
    image: 'assets/images/user/market-card-01.png',
    status: '已結束',
    statusClass: 'ended',
    tags: [BrandType.family],
    category: BrandType.family,
    city: '台南市',
    area: '安南區',
    desc: '在歷史與綠意之間，孩子們自在奔跑，大小朋友都能找到喜歡的故事與手作好物。',
  },
  {
    title: '小火柴文創市集｜水交社文化園區',
    start_date: '2024/05/18',
    end_date: '2024/05/19',
    location: '台南市 南區',
    image: 'assets/images/user/market-card-02.png',
    status: '已結束',
    statusClass: 'ended',
    tags: [BrandType.handmade],
    category: BrandType.handmade,
    city: '台南市',
    area: '南區',
    desc: '老眷村裡的新故事，文創與手作的溫度，一起感受生活的美好與創意的力量。',
  },
  {
    title: '森林手作生活節｜台中審計新村',
    start_date: '2024/04/20',
    end_date: '2024/04/21',
    location: '台中市 西區',
    image: 'assets/images/user/market-card-03.png',
    status: '已結束',
    statusClass: 'ended',
    tags: [BrandType.handmade],
    category: BrandType.handmade,
    city: '台中市',
    area: '西區',
    desc: '在老屋與綠樹之間，慢下腳步，享受手作、設計與生活風格的美好日常。',
  },
  {
    title: '夏日選物散步市集｜高雄駁二藝術特區',
    start_date: '2024/03/09',
    end_date: '2024/03/10',
    location: '高雄市 鹽埕區',
    image: 'assets/images/user/market-card-04.png',
    status: '已結束',
    statusClass: 'ended',
    tags: [BrandType.fashion],
    category: BrandType.fashion,
    city: '高雄市',
    area: '鹽埕區',
    desc: '海風、陽光與好物相遇，在駁二散步挖寶，感受港都的夏日魅力。',
  },
];

  // get displayMarkets(): MarketCardItem[] {
  //   return this.activeTab === 'current'? this.markets: this.historyMarkets;
  // }

  /**
   * 切換顯示的標籤
   * @param tab 要切換到的標籤（'current' 或 '  history'）
   */
  changeTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
  }

  /**
   * 導航到市集詳情頁
   * @param market 選擇的市集
   */
  goToActivityDetail(market: MarketCardItem) {
    // 這裡可以根據實際路由設定來導航到市集詳情頁
    this.router.navigate(['/user/activity-detail'], {
      // 使用 state 傳遞選擇的市集數據
      state: { market }
    });
  }

  /**
   * 歷史活動的查看詳情先導航到市集詳情頁
   * @param market 選擇的市集
   */
  goToActivityHistory(market: HistoryMarketCardItem){
    // 這裡可以根據實際路由設定來導航到市集詳情頁
    this.router.navigate(['/user/activity-detail'], {
      // 使用 state 傳遞選擇的市集數據
      state: { market }
    });
  }
}