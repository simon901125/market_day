import { Component, Input } from '@angular/core';
import { HistoryMarketCardItem } from '../../../../../models/HistoryMarketCardItem';

@Component({
  selector: 'app-user-history-market-card',
  imports: [],
  templateUrl: './user-history-market-card.html',
  styleUrl: './user-history-market-card.scss',
})
export class UserHistoryMarketCard {
  @Input({ required: true }) market!: HistoryMarketCardItem;
}
