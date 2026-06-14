import { Component, Input } from '@angular/core';
import { Router} from '@angular/router';
import { HistoryMarketCardItem } from '../../../../../models/HistoryMarketCardItem';
import { MarketCardItem } from '../../../../../models/MarketCardItem';

@Component({
  selector: 'app-user-history-market-card',
  imports: [],
  templateUrl: './user-history-market-card.html',
  styleUrl: './user-history-market-card.scss',
})
export class UserHistoryMarketCard {
  constructor(private router: Router) {}
  @Input({ required: true }) market!: HistoryMarketCardItem;

  /**
     * 導航到市集詳情頁
     * @param market 選擇的市集
     */
    goToActivityDetail(market: MarketCardItem) {
      // 這裡可以根據實際路由設定來導航到市集詳情頁
      this.router.navigate(['/user/activity-detail'], {
        // 使用 state 傳遞選擇的市集數據
        state: { market }
      });
    }

}