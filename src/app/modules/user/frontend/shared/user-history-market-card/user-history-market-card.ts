import { Component, Input } from '@angular/core';
import { HistoryMarketCardItem } from '../../../../../models/interface/user/HistoryMarketCardItem';

@Component({
  selector: 'app-user-history-market-card',
  standalone: true,
  imports: [],
  templateUrl: './user-history-market-card.html',
  styleUrl: './user-history-market-card.scss',
})
/** 歷史活動橫式卡片，顯示已結束活動的摘要資訊。 */
export class UserHistoryMarketCard {
  /** 歷史活動資料，由父層列表傳入。 */
  @Input({ required: true }) market!: HistoryMarketCardItem;

  /** 從完整地點中移除縣市與行政區，讓卡片上的場地名稱更精簡。 */
  get venueName(): string {
    const cityArea = `${this.market.city}${this.market.area}`;
    const cityAreaWithSpace = `${this.market.city} ${this.market.area}`;

    return this.market.location
      .replace(cityAreaWithSpace, '')
      .replace(cityArea, '')
      .trim();
  }
}
