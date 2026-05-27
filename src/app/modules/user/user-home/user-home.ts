import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserMarketSearchPanel } from '../user-market-search-panel/user-market-search-panel';
import { VendorFeature } from '../../../models/VendorFeature';
import { MarketCardItem } from '../../../models/MarketCardItem';
import { UserMarketCard } from '../user-market-card/user-market-card';

@Component({
  selector: 'app-user-home',
  imports: [RouterLink, UserMarketSearchPanel, UserMarketCard],
  templateUrl: './user-home.html',
  styleUrl: './user-home.scss',
})
export class UserHome {
  markets: MarketCardItem[] = [
    {
      title: '草悟野餐市集',
      date: '2024/05/24（五）- 05/26（日）',
      location: '台中市西區 草悟廣場',
      image: 'assets/images/market-card-01.png',
      status: '進行中',
      statusClass: 'active',
      tags: ['野餐', '手作', '親子友善'],
    },
    {
      title: '咖啡生活節',
      date: '2024/06/07（五）- 06/09（日）',
      location: '台中市南屯區 文心森林公園',
      image: 'assets/images/market-card-02.png',
      status: '即將開始',
      statusClass: 'upcoming ',
      tags: ['咖啡', '甜點', '生活風格'],
    },
    {
      title: '夏日風格服裝市集',
      date: '2024/06/14（五）- 06/16（日）',
      location: '台中市西區 審計新村',
      image: 'assets/images/market-card-03.png',
      status: '即將開始',
      statusClass: 'upcoming ',
      tags: ['服飾', '配件', '設計品牌'],
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