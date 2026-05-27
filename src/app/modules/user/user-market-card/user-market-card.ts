import { Component, Input } from '@angular/core';
import { MarketCardItem } from '../../../models/MarketCardItem';

@Component({
  selector: 'app-user-market-card',
  imports: [],
  templateUrl: './user-market-card.html',
  styleUrl: './user-market-card.scss',
})
export class UserMarketCard {
  @Input({ required: true }) market!: MarketCardItem;
}
