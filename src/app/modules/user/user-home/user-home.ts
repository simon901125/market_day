import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  markets: MarketCardItem[] = [
    {
      title: '草地野餐市集',
      date: '2024/05/24（五）- 05/26（日）',
      description: '在草地上享受美食和音樂，與家人朋友共度美好時光。',
      time: '10:00 - 18:00',
      location: '台中市西區 草悟道',
      image: 'assets/images/market-card-01.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
    },
    {
      title: '台北精品咖啡生活節',
      date: '2024/05/24（五）- 05/26（日）',
      description: '體驗精品咖啡的香醇與文化，享受慢活的惬意時光。',
      time: '10:00 - 18:00',
      location: '台北市中山區 華山1914文創園區',
      image: 'assets/images/market-card-02.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
    },
    {
      title: '手作設計市集',
      date: '2024/05/25（六）- 05/26（日）',
      description: '匯聚各式手作設計品牌，展現創意與工藝的魅力。',
      time: '10:00 - 18:00',
      location: '台南市中西區 藍晒圖文創園區',
      image: 'assets/images/market-card-03.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.handmade, BrandType.fashion, BrandType.toy],
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
}