import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../models/MarketCardItem';
import { CommonModule } from '@angular/common';
import { CountMarketDaysPipe } from '../../../pipes/count-market-days-pipe';

@Component({
  selector: 'app-user-activity-detail',
  imports: [CommonModule,  RouterLink, CountMarketDaysPipe],
  templateUrl: './user-activity-detail.html',
  styleUrl: './user-activity-detail.scss',
})
export class UserActivityDetail {
  /** 市集詳細資訊 */
  market: MarketCardItem | null = null;
  
  /** 是否顯示市集攤位資訊 */
  isMarketMapInfo: boolean = false;

  diffDays: number = 0;
  diffTxt: string = '';

  constructor(private router: Router) {
    // 使用 currentNavigation 信號獲取傳遞的數據
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || null;
  }

  //這裡先寫假資料，等串接後再改成傳入的資料
  /**
   * 公開市集攤位資訊
   * @returns Boolean：是否顯示攤位資訊公告
   */
  openMarketInfo(){
    /** 當前日期 */
    let today: Date = new Date();
    /** 攤位公開日期 */
    let infoDate = new Date(2026, 7, 20); // 假設攤位公開日期是 2026/05/20
    if(infoDate > today){
      this.isMarketMapInfo = false;
      return true;
    }else{
      this.isMarketMapInfo = true;
      return false;
    }
  }

  // /** 切換市集攤位資訊的顯示狀態 */
  // toggleMarketMapInfo(){
  //   this.isMarketMapInfo = !this.isMarketMapInfo;
  // }

  /**
   * 計算剩餘天數
   * @param startDate 市集開始日期
   * @returns 剩餘市集天數
   */
  countMarketDays(startDate: string) {
    /** 當前日期 */
    let today = new Date();
    // 計算活動天數的邏輯
    let formatStartDate = startDate.split('/');
    /** 格式化日期 */
    let newStartDate = new Date(Number(formatStartDate[0]), Number(formatStartDate[1]) - 1, Number(formatStartDate[2]));
    // 計算活動天數
    // 計算活動開始日期與今天的時間差
    /** 時間差 */
    let timeDiff = newStartDate.getTime() - today.getTime();
    /** 活動天數 */
    let dayDiff =  Math.abs(Math.ceil(timeDiff / (1000 * 3600 * 24)));
    let dayDiffTxt = String(dayDiff);
    if(dayDiff == 0){
      dayDiffTxt = '';
    }
    return dayDiff;

  }

  

  
}
