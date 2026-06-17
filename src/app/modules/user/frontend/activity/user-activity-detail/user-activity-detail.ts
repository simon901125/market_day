import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { MarketCardItem } from '../../../../../models/MarketCardItem';
import { MarketStatus } from '../../../../../models/status/MarketStatus';

interface TrafficItem {
  icon: string;
  label: string;
  text: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;

@Component({
  selector: 'app-user-activity-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-activity-detail.html',
  styleUrl: './user-activity-detail.scss',
})
export class UserActivityDetail {
  market: MarketCardItem | null = null;

  readonly trafficItems: TrafficItem[] = [
    {
      icon: 'bi bi-train-front',
      label: '捷運',
      text: '文心森林公園站（G10），步行約 8 分鐘',
    },
    {
      icon: 'bi bi-bus-front',
      label: '公車',
      text: '豐樂 53、73、75、85、99，於「文心森林公園站」下車',
    },
    {
      icon: 'bi bi-car-front-fill',
      label: '開車',
      text: '公園周邊設有收費停車場',
    },
  ];

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;
  }

  get showBoothInfo(): boolean {
    return this.market?.status !== MarketStatus.preview;
  }

  get showAnnouncement(): boolean {
    return !this.showBoothInfo;
  }

  get activityIntroExtra(): string {
    return '這場市集活動將串連在地創作者、精選品牌與生活風格攤位，規劃適合慢慢逛、好好交流的市集動線。現場除了選物與輕食，也會依活動主題安排互動體驗與品牌展示，讓逛市集不只是購物，而是把週末留給生活感的一段小旅行。';
  }

  get organizerName(): string {
    return this.market?.organizer ?? '小集日活動企劃';
  }

  get breadcrumbSectionLabel(): string {
    return this.market?.status === MarketStatus.ended ? '歷史活動' : '目前活動';
  }

  get breadcrumbSectionLink(): string {
    return this.market?.status === MarketStatus.ended
      ? '/user/activity-list/history'
      : '/user/activity-list';
  }

  openMarketInfo(): boolean {
    return !this.showBoothInfo;
  }

  countMarketDays(startDate: string): number {
    if (!startDate) {
      return 0;
    }

    const today = this.todayStart();
    const start = this.parseDate(startDate);
    return Math.max(0, Math.ceil((start.getTime() - today.getTime()) / DAY_MS));
  }

  marketDaysText(startDate: string, endDate = this.market?.end_date ?? ''): string {
    if (!startDate) {
      return '';
    }

    const today = this.todayStart();
    const start = this.parseDate(startDate);
    const end = endDate ? this.parseDate(endDate) : start;

    if (today > end) {
      return '活動已結束';
    }

    if (today >= start && today <= end) {
      return '活動進行中';
    }

    return '距離活動開始還有';
  }

  private parseDate(value: string): Date {
    const [year, month, day] = value.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  private todayStart(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
}
