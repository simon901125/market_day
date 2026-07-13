import { Component, Input } from '@angular/core';
import { VendorHeader } from '../vendor-header/vendor-header';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { BrandItem } from '../../../../models/interface/shared/BrandItem';
import { BrandType } from '../../../../models/type/BrandType ';
import { RouterLink, Router } from '@angular/router';
import { VendorMarketCard } from '../vendor-market-card/vendor-market-card';

// interface MarketSlot {
//   date: string;
//   count: number;
// }

@Component({
  selector: 'app-vendor-home',
  imports: [VendorHeader, UserFooter, VendorMarketCard, RouterLink],
  templateUrl: './vendor-home.html',
  styleUrl: './vendor-home.scss',
})
export class VendorHome {
  constructor(private router: Router) {}

  // 首頁顯示的近期市集活動資料
  markets: MarketCardItem[] = [
    {
      title: '草地野餐市集',
      start_date: '2026/08/17',
      end_date: '2026/08/19',
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
      price: 600,
      slots: [
        { date: '08/17', remaining: 15 },
        { date: '08/19', remaining: 8 },
      ],
    },
    {
      title: '台北精品咖啡生活節',
      start_date: '2026/08/24',
      end_date: '2026/08/26',
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
      transportation: ['捷運紅線：忠孝新生站', '公車：藍5、藍7、藍10路'],
      price: 600,
      slots: [
        { date: '08/24', remaining: 15 },
        { date: '08/26', remaining: 5 },
      ],
    },
    {
      title: '手作設計市集',
      start_date: '2026/08/31',
      end_date: '2026/09/02',
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
      transportation: ['捷運：台南火車站步行約 10 分鐘', '公車：綠幹線、藍幹線'],
      price: 600,
      slots: [
        { date: '08/31', remaining: 6 },
        { date: '09/02', remaining: 1 },
      ],
    },
  ];

  get recentMarkets(): MarketCardItem[] {
    return this.markets.slice(0, 3);
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
