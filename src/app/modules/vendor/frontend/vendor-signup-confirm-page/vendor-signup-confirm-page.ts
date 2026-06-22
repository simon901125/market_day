import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';

//這個要移出去
interface SignupConfirmData {
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
  selector: 'app-vendor-signup-confirm-page',
  imports: [RouterLink],
  templateUrl: './vendor-signup-confirm-page.html',
  styleUrl: './vendor-signup-confirm-page.scss',
})
export class VendorSignupConfirmPage {
  /** 從報名資料填寫頁帶入的市集資料。 */
  market: MarketCardItem | null = null;

  /** 從報名資料填寫頁帶入的表單與費用試算資料。 */
  signup: SignupConfirmData | null = null;

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;
    this.signup = navigation?.extras.state?.['signup'] || history.state?.['signup'] || null;
  }

  /** 場次日期優先使用表單選取結果，沒有資料時回退到市集開始日。 */
  get selectedSlotDate(): string {
    return this.signup?.slotDate || this.market?.start_date || '-';
  }

  /** 攤位規格由表單頁帶入，沒有資料時顯示預設規格。 */
  get boothSpec(): string {
    return this.signup?.boothSpec || '2*3米 / 2.7*3米 / 1.5米';
  }

  /** 以下費用皆由表單頁試算結果帶入，確認頁只負責顯示。 */
  get boothFee(): number {
    return this.signup?.boothFee ?? this.market?.price ?? 0;
  }

  get boothDeposit(): number {
    return this.signup?.boothDeposit ?? 1000;
  }

  get powerRentalFee(): number {
    return this.signup?.powerRentalFee ?? 0;
  }

  get totalFee(): number {
    return this.signup?.totalFee ?? this.boothFee + this.boothDeposit + this.powerRentalFee;
  }

  /** 補充資料若未填寫，確認頁統一顯示「無」。 */
  get powerUsage(): string {
    return this.signup?.formData.powerUsage?.trim() || '無';
  }

  get vehicleNumber(): string {
    return this.signup?.formData.vehicleNumber?.trim() || '無';
  }

  get note(): string {
    return this.signup?.formData.note?.trim() || '無';
  }

  /** 攤位類別在確認頁以文字列出，沒有勾選時顯示「未選擇」。 */
  get categoryText(): string {
    return this.signup?.categories.length ? this.signup.categories.join('、') : '未選擇';
  }

  /** 返回表單頁時把目前資料帶回去，避免使用者修改資料時市集資訊遺失。 */
  backToForm(): void {
    this.router.navigate(['/vendor/sign-up-form'], {
      state: {
        market: this.market,
        signup: this.signup,
      },
    });
  }

  /** 返回市集詳細頁，同樣保留目前市集資料。 */
  backToDetail(): void {
    this.router.navigate(['/vendor/sign-up-detail'], {
      state: { market: this.market },
    });
  }

  /** 確認送出後前往完成頁，沿用同一份 market 與 signup 資料作顯示。 */
  goToComplete(): void {
    this.router.navigate(['/vendor/sign-up-complete'], {
      state: {
        market: this.market,
        signup: this.signup,
        submittedAt: new Date().toISOString(),
      },
    });
  }
}
