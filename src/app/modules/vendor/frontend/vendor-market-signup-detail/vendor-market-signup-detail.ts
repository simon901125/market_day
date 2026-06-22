import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

@Component({
  selector: 'app-vendor-market-signup-detail',
  imports: [VendorHeader, UserFooter],
  templateUrl: './vendor-market-signup-detail.html',
  styleUrl: './vendor-market-signup-detail.scss',
})
export class VendorMarketSignupDetail {
  /** 從列表頁帶入的市集資料，detail 與後續報名流程共用。 */
  market: MarketCardItem | null = null;

  /** 右側「選擇參加場次」目前選取的 index。 */
  selectedSlotIndex = 0;

  readonly boothTotal = 200;
  readonly boothSpec = '2*3米 / 2.7*3米 / 1.5米';

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;

    const stateIndex = navigation?.extras.state?.['selectedSlotIndex'] ?? history.state?.['selectedSlotIndex'];
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

    start.setDate(start.getDate() - 14);
    return start.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  get priceText(): string {
    return this.market?.price ? `$${this.market.price} / 攤` : '依主辦單位公告';
  }

  get slots(): MarketSlot[] {
    return this.market?.slots ?? [];
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

  /** 前往報名資料填寫頁，並帶入目前市集與已選擇場次。 */
  goToSignUpForm(): void {
    this.router.navigate(['/vendor/sign-up-form'], {
      state: {
        market: this.market,
        selectedSlotIndex: this.selectedSlotIndex,
      },
    });
  }
}
