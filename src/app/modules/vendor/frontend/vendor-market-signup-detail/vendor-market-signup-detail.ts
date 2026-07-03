import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

@Component({
  selector: 'app-vendor-market-signup-detail',
  imports: [VendorHeader, UserFooter, RouterLink],
  templateUrl: './vendor-market-signup-detail.html',
  styleUrl: './vendor-market-signup-detail.scss',
})
export class VendorMarketSignupDetail {
  /** 從列表頁帶入的市集資料，detail 與後續報名流程共用。 */
  market: MarketCardItem | null = null;

  /** 「每日剩餘名額」目前選取的 index。 */
  selectedSlotIndex = 0;

  readonly boothTotal = 200;
  readonly signupSteps = [
    {
      icon: 'bi-pencil',
      title: '填寫報名資料',
      description: '填寫品牌與攤位需求，並上傳相關申請文件。',
    },
    {
      icon: 'bi-file-earmark-text',
      title: '確認送出申請',
      description: '確認資料無誤後送出報名申請。',
    },
    {
      icon: 'bi-hourglass-split',
      title: '等待資格審核',
      description: '主辦方將依品牌與品項進行審核。',
    },
    {
      icon: 'bi-credit-card',
      title: '完成費用付款',
      description: '審核通過後，於期限內完成繳費。',
    },
    { icon: 'bi-geo-alt', title: '選擇攤位', description: '付款成功後，依通知選擇可用攤位。' },
    { icon: 'bi-check-circle', title: '完成報名', description: '完成選位後，即完成本次市集報名。' },
  ];

  readonly notices = [
    {
      icon: 'bi-patch-check',
      title: '報名資格',
      items: [
        '每位攤主同一活動僅能報名一次。',
        '完成資料填寫後，始可送出報名。',
        '品項須符合本活動招商類別。',
      ],
    },
    {
      icon: 'bi-diagram-3',
      title: '取消與退款',
      items: [
        '審核後、付款前可自行取消報名。',
        '完成付款後，請依退款規範辦理。',
        '名額截止前提出退費申請。',
      ],
    },
    {
      icon: 'bi-calendar2-event',
      title: '活動規範',
      items: [
        '設備數量有限，依完成報名順序保留。',
        '額外用電須事先申請。',
        '活動當日請依指定時間完成報到。',
      ],
    },
    {
      icon: 'bi-shield-check',
      title: '保證金退還',
      items: [
        '活動結束且設備確認無損後退還。',
        '現場清潔與垃圾請自行處理。',
        '違反活動規範者得酌收保證金。',
      ],
    },
  ];

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;

    const stateIndex =
      navigation?.extras.state?.['selectedSlotIndex'] ?? history.state?.['selectedSlotIndex'];
    if (typeof stateIndex === 'number') {
      this.selectedSlotIndex = stateIndex;
    }
  }

  get dateRangeText(): string {
    if (!this.market) return '-';
    return `${this.market.start_date} - ${this.market.end_date}`;
  }

  get signupDeadline(): string {
    if (!this.market) return '-';

    const start = new Date(this.market.start_date);
    if (Number.isNaN(start.getTime())) return this.market.end_date;

    start.setDate(start.getDate() - 10);
    return this.formatDate(start);
  }

  get signupRangeText(): string {
    if (!this.market) return '-';

    const start = new Date(this.market.start_date);
    if (Number.isNaN(start.getTime())) return `即日起 - ${this.signupDeadline}`;

    const openDate = new Date(start);
    openDate.setDate(openDate.getDate() - 60);
    return `${this.formatDate(openDate)} - ${this.signupDeadline} 23:59`;
  }

  get priceText(): string {
    return this.market?.price ? `$${this.market.price} / 攤` : '依主辦單位公告';
  }

  get slots(): MarketSlot[] {
    if (this.market?.slots?.length) {
      return this.market.slots;
    }

    if (!this.market) return [];
    const start = this.parseDate(this.market.start_date);
    const end = this.parseDate(this.market.end_date);
    if (!start || !end || end < start) return [];

    const slots: MarketSlot[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      slots.push({
        date: `${String(cursor.getMonth() + 1).padStart(2, '0')}/${String(cursor.getDate()).padStart(2, '0')}`,
        remaining: this.boothTotal,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return slots;
  }

  get selectedSlot(): MarketSlot | null {
    return this.slots[this.selectedSlotIndex] ?? null;
  }

  get selectedSlotDate(): string {
    return this.selectedSlot?.date || this.market?.start_date || '-';
  }

  get remainingBooths(): number {
    return this.slots.reduce((total, slot) => total + slot.remaining, 0);
  }

  /** 判斷指定場次是否為目前選取狀態，供 template 切換 active 樣式。 */
  isSelectedSlot(index: number): boolean {
    return this.selectedSlotIndex === index;
  }

  /** 點選 radio 時更新目前場次，讓畫面與後續報名資料同步。 */
  selectSlot(index: number): void {
    this.selectedSlotIndex = index;
  }

  slotDateLabel(date: string): string {
    const normalizedDate =
      date.includes('/') && date.split('/').length === 2 && this.market
        ? `${new Date(this.market.start_date).getFullYear()}/${date}`
        : date;
    const parsedDate = new Date(normalizedDate);
    if (Number.isNaN(parsedDate.getTime())) return date;

    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${date}（${weekdays[parsedDate.getDay()]}）`;
  }

  /** 前往報名資料填寫頁，並帶入目前市集與已選擇場次。 */
  goToSignUpForm(): void {
    this.router.navigate(['/vendor/sign-up-form'], {
      state: {
        market: this.market,
        slots: this.slots,
        selectedSlotIndex: this.selectedSlotIndex,
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  private parseDate(value: string): Date | null {
    const parts = value.match(/\d+/g)?.map(Number) ?? [];
    if (parts.length < 3) return null;

    const [year, month, day] = parts;
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
