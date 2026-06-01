import { Component } from '@angular/core';
import { RouterLink,Router } from '@angular/router';
import { UserMarketSearchPanel } from '../user-market-search-panel/user-market-search-panel';
import { VendorFeature } from '../../../models/VendorFeature';
import { MarketCardItem } from '../../../models/MarketCardItem';
import { UserMarketCard } from '../user-market-card/user-market-card';
import { BrandType } from '../../../models/BrandType ';
import { MarketStatus } from '../../../models/MarketStatus ';

@Component({
  selector: 'app-user-home',
  imports: [RouterLink, UserMarketSearchPanel, UserMarketCard],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome {
  constructor(private router: Router) {}
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
      image: 'assets/images/market-card-01.png',
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
      image: 'assets/images/market-card-02.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
      organizer: '台北市政府',
      Transportation: ['捷運紅線：忠孝新生站', '公車：藍5、藍7、藍10路']
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
      image: 'assets/images/market-card-03.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.handmade, BrandType.fashion, BrandType.toy],
      organizer: '台南市政府',
      Transportation: ['公車：綠幹線、藍幹線', '計程車：台南火車站搭乘約10分鐘']
    },
  ];

  vendorFeatures: VendorFeature[] = [
    {
      title: '可報名活動',
      desc: '快速瀏覽最新市集，一鍵報名參與',
      image: 'assets/images/vendor-phone-01.png',
    },
    {
      title: '品牌曝光',
      desc: '專屬品牌頁面，展現你的商品與風格',
      image: 'assets/images/vendor-phone-02.png',
    },
    {
      title: '輕鬆管理',
      desc: '掌握報名狀態與活動通知提醒',
      image: 'assets/images/vendor-status-card.png',
    },
  ];

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