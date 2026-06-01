import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../models/MarketCardItem';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-activity-detail',
  imports: [CommonModule,  RouterLink],
  templateUrl: './user-activity-detail.html',
  styleUrl: './user-activity-detail.scss',
})
export class UserActivityDetail {
  market: MarketCardItem | null = null;
  constructor(private router: Router) {
    // 使用 currentNavigation 信號獲取傳遞的數據
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || null;
  }

  /** 活動日期 */
  dateStart: string = '';
  /** 活動結束日期 */
  dateEnd: string = ''
  /** 活動日期範圍 */
  dateRange: string = '';


  // 之後資料面應該不會傳'2024/06/15（六）- 06/16（日）'這種格式，會直接傳兩個日期，所以這裡的解析邏輯可能需要調整
  /**
   * 計算活動天數
   * @returns 活動天數
   */
  countMartketDays(): string {
    // 如果沒有日期，返回空字串
    if (!this.market?.date) return '';
    /** 原始日期 */
    let rawDate = this.market.date;
    /** 正規化後的日期 */
    let normalized = rawDate.replace(/（.*?）/g, '').trim();
    /** 分割日期範圍 */
    let parts = normalized.split(/\s*[-–—]\s*/);

    // 如果分割後的部分不足兩個，返回空字串
    if (parts.length < 2) return '';
    this.dateStart = parts[0].trim();
    this.dateEnd = parts[1].trim();
    /** 開始日期 */
    let startDate = new Date(this.dateStart);
    /** 結束日期 */
    let endDate = new Date(this.dateEnd);
    /** 當前日期 */
    let today = new Date();
    if(today > endDate) return '活動已結束';
    else{
      today.setHours(0, 0, 0, 0);
      if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return '';
      /** 距離活動開始的天數 */
      let dayCount = Math.ceil(( startDate.getTime()-today.getTime() ) / (1000 * 3600 * 24)) + 1;
      return `${dayCount} 天`;
    }
  }
}
