import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countMarketDays'
})
export class CountMarketDaysPipe implements PipeTransform {

  transform(startDate: string): string {
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
    let dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if(dayDiff > 0) {
      return `距離活動開始`;
    } else if(dayDiff === 0) {
      return '活動今天開始';
    } else {
      return `活動已經開始了`;
    }
    
  }

}
