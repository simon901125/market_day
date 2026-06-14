import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../../models/MarketCardItem';
import { MarketSlot } from '../../../../models/MarketSlot';

interface SignupCompleteData {
  slot: MarketSlot | null;
  slotDate: string;
  categories: string[];
  formData: {
    powerUsage: string;
    vehicleNumber: string;
    note: string;
    rentPower: boolean;
  };
  boothSpec: string;
  boothFee: number;
  boothDeposit: number;
  powerRentalFee: number;
  totalFee: number;
}

@Component({
  selector: 'app-vendor-signup-complete-page',
  imports: [RouterLink],
  templateUrl: './vendor-signup-complete-page.html',
  styleUrl: './vendor-signup-complete-page.scss',
})
export class VendorSignupCompletePage {
  /** 從確認頁帶入的市集資料，用來顯示市集名稱與回到詳細頁。 */
  market: MarketCardItem | null = null;

  /** 從確認頁帶入的報名資料，用來顯示場次、攤位與總金額。 */
  signup: SignupCompleteData | null = null;

  /** 送出時間由確認頁建立；若直接進入此頁，會以目前時間作為備援。 */
  submittedAt = new Date().toISOString();

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;
    this.signup = navigation?.extras.state?.['signup'] || history.state?.['signup'] || null;
    this.submittedAt = navigation?.extras.state?.['submittedAt'] || history.state?.['submittedAt'] || this.submittedAt;
  }

  /** 報名編號先以前端產生，未來可改成後端 API 回傳的正式編號。 */
  get applicationNo(): string {
    const dateText = this.selectedSlotDate.replace(/\D/g, '').padEnd(8, '0').slice(0, 8);
    const marketSeed = (this.market?.title.length ?? 0) + this.totalFee;
    return `MD${dateText}-${String(marketSeed % 1000).padStart(3, '0')}`;
  }

  /** 申請時間格式化為設計稿使用的 yyyy/MM/dd HH:mm。 */
  get submittedAtText(): string {
    const date = new Date(this.submittedAt);
    if (Number.isNaN(date.getTime())) return '-';

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd} ${hh}:${min}`;
  }

  /** 場次日期與攤位規格都從 signup 資料帶入，沒有資料時提供備援文字。 */
  get selectedSlotDate(): string {
    return this.signup?.slotDate || this.market?.start_date || '-';
  }

  get sessionText(): string {
    return `${this.selectedSlotDate} ${this.market?.time ?? ''}`.trim();
  }

  get boothSpec(): string {
    return this.signup?.boothSpec || '2*3米 / 2.7*3米 / 1.5米';
  }

  get totalFee(): number {
    return this.signup?.totalFee ?? 0;
  }

  /** 返回市集詳細頁時保留 market，避免 detail 頁資料遺失。 */
  backToDetail(): void {
    this.router.navigate(['/vendor/sign-up-detail'], {
      state: { market: this.market },
    });
  }
}
