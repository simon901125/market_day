import { Component, Input } from '@angular/core';
import { HistoryMarketCardItem } from '../../../../../models/interface/HistoryMarketCardItem';

@Component({
  selector: 'app-user-history-market-card',
  standalone: true,
  imports: [],
  templateUrl: './user-history-market-card.html',
  styleUrl: './user-history-market-card.scss',
})
export class UserHistoryMarketCard {
  @Input({ required: true }) market!: HistoryMarketCardItem;

  get venueName(): string {
    const cityArea = `${this.market.city}${this.market.area}`;
    const cityAreaWithSpace = `${this.market.city} ${this.market.area}`;

    return this.market.location
      .replace(cityAreaWithSpace, '')
      .replace(cityArea, '')
      .trim();
  }
}
