import { Component,Input } from '@angular/core';
import { MarketCardItem } from '../../../../models/MarketCardItem';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { BrandType } from '../../../../models/type/BrandType ';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-vendor-market-card',
  imports: [RouterLink],
  templateUrl: './vendor-market-card.html',
  styleUrl: './vendor-market-card.scss',
})
export class VendorMarketCard {
  keyword = '';
  selectedCity = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 6;
  
@Input({ required: true }) market!: MarketCardItem;

  getStatusClass(status: String): string {
    return MarketStatus.getClass(status as string);
  }

  getDeadlineText(startDate: string): string {
    const start = new Date(startDate);
    const deadline = new Date(start);
    deadline.setDate(deadline.getDate() - 14);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / 86400000);

    if (diffDays <= 0) return '報名已截止';

    return `${diffDays} 天後報名截止`;
  }
}
