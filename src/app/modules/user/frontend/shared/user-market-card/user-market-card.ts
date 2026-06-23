import { Component, Input } from '@angular/core';
import { MarketCardItem } from '../../../../../models/interface/shared/MarketCardItem';

@Component({
  selector: 'app-user-market-card',
  imports: [],
  templateUrl: './user-market-card.html',
  styleUrl: './user-market-card.scss',
})
/** 目前活動卡片，負責呈現活動封面、日期、地點、狀態與分類標籤。 */
export class UserMarketCard {
  /** 活動列表或首頁傳入的單一活動資料。 */
  @Input({ required: true }) market!: MarketCardItem;
}
