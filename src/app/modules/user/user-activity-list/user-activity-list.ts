import { Component } from '@angular/core';
import { MarketCardItem } from '../../../models/MarketCardItem';
import { UserMarketSearchPanel } from '../user-market-search-panel/user-market-search-panel';
import { UserMarketCard } from '../user-market-card/user-market-card';
import { UserHistoryMarketCard } from '../user-history-market-card/user-history-market-card';
import { HistoryMarketCardItem } from '../../../models/HistoryMarketCardItem';
import { BrandType } from '../../../models/BrandType ';
import { MarketStatus } from '../../../models/MarketStatus ';

@Component({
  selector: 'app-user-activity-list',
  imports: [UserMarketSearchPanel, UserMarketCard, UserHistoryMarketCard],
  templateUrl: './user-activity-list.html',
  styleUrl: './user-activity-list.scss',
})
export class UserActivityList {
  activeTab: 'current' | 'history' = 'current';

  markets: MarketCardItem[] = [
    {
      title: '草地野餐市集',
      date: '2024/05/24（五）- 05/26（日）',
      location: '台中市西區 草悟道',
      image: 'assets/images/market-card-01.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.family],
    },
    {
      title: '台北精品咖啡生活節',
      date: '2024/05/24（五）- 05/26（日）',
      location: '台北市中山區 華山1914文創園區',
      image: 'assets/images/market-card-02.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.food, BrandType.handmade, BrandType.fashion],
    },
    {
      title: '手作設計市集',
      date: '2024/05/25（六）- 05/26（日）',
      location: '台南市中西區 藍晒圖文創園區',
      image: 'assets/images/market-card-03.png',
      status: MarketStatus.active,
      statusClass: MarketStatus.getClass(MarketStatus.active),
      tags: [BrandType.handmade, BrandType.fashion, BrandType.toy],
    },
    {
      title: '山系生活戶外市集',
      date: '2024/05/07（二）- 06/09（日）',
      location: '新竹市西區 新竹公園',
      image: 'assets/images/market-card-04.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.fashion, BrandType.family],
    },
    {
      title: '毛孩友善市集',
      date: '2024/06/08（六）- 06/09（日）',
      location: '高雄市鼓山區 駁二藝術特區',
      image: 'assets/images/market-card-05.png',
      status: MarketStatus.upcoming,
      statusClass: MarketStatus.getClass(MarketStatus.upcoming),
      tags: [BrandType.pet, BrandType.family],
    },
    {
      title: '植感生活市集',
      date: '2024/06/15（六）- 06/16（日）',
      location: '台中市北區 審計新村',
      image: 'assets/images/market-card-06.png',
      status: MarketStatus.preview,
      statusClass: MarketStatus.getClass(MarketStatus.preview),
      tags: [BrandType.plant, BrandType.handmade, BrandType.family],
    },
  ];

  // historyMarkets: HistoryMarketCardItem[] = [
  //   {
  //     title: '小樹市集｜台灣歷史博物館戶外廣場',
  //     date: '2024/06/15（六）- 06/16（日）',
  //     location: '台南市 安南區',
  //     image: 'assets/images/history-market-01.png',
  //     status: '已結束',
  //     statusClass: 'ended',
  //     tags: ['親子家庭', '戶外', '歷史文化'],
  //   },
  //   {
  //     title: '小火柴文創市集｜水交社文化園區',
  //     date: '2024/05/18（六）- 05/19（日）',
  //     location: '台南市 南區',
  //     image: 'assets/images/history-market-02.png',
  //     status: '已結束',
  //     statusClass: 'ended',
  //     tags: ['文創', '手作', '設計'],
  //   },
  //   {
  //     title: '森林手作生活節｜台中審計新村',
  //     date: '2024/04/20（六）- 04/21（日）',
  //     location: '台中市 西區',
  //     image: 'assets/images/history-market-03.png',
  //     status: '已結束',
  //     statusClass: 'ended',
  //     tags: ['生活風格', '設計', '手作'],
  //   },
  // ];

  // get displayMarkets(): MarketCardItem[] {
  //   return this.activeTab === 'current'? this.markets: this.historyMarkets;
  // }

  changeTab(tab: 'current' | 'history'): void {
    this.activeTab = tab;
  }
}