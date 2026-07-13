import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

interface CompleteEquipment {
  id: string;
  name: string;
  quantity: number;
}

interface CompletePowerOption {
  id: string;
  label: string;
}

interface SignupCompleteData {
  slot: MarketSlot | null;
  slotDate: string;
  selectedSlots?: MarketSlot[];
  categories: string[];
  equipment?: CompleteEquipment[];
  powerOptions?: CompletePowerOption[];
  formData: {
    powerUsage: string;
    vehicleNumber: string;
    note: string;
    rentPower: boolean;
    hasVehicle?: boolean;
  };
  boothSpec: string;
  boothFee: number;
  boothDeposit: number;
  powerRentalFee: number;
  totalFee: number;
}

@Component({
  selector: 'app-vendor-signup-complete-page',
  imports: [RouterLink, UserFooter, VendorHeader],
  templateUrl: './vendor-signup-complete-page.html',
  styleUrl: './vendor-signup-complete-page.scss',
})
export class VendorSignupCompletePage {
  readonly nextSteps = [
    {
      icon: 'bi-clipboard2-check',
      title: '審核中',
      description: '主辦單位將審核您的報名資料，約需 3–5 個工作天。',
    },
    {
      icon: 'bi-envelope',
      title: '審核結果通知',
      description: '審核結果將以 Email 通知，並可至系統查看。',
    },
    {
      icon: 'bi-currency-dollar',
      title: '待付款',
      description: '審核通過後，需於期限內完成付款及保證金。',
    },
    {
      icon: 'bi-geo-alt',
      title: '選擇攤位',
      description: '付款完成後，將開放攤位地圖供您選擇。',
    },
    {
      icon: 'bi-check-circle',
      title: '報名完成',
      description: '完成選位後，您的報名才算正式完成。',
    },
  ];

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
    this.submittedAt =
      navigation?.extras.state?.['submittedAt'] ||
      history.state?.['submittedAt'] ||
      this.submittedAt;
  }

  /** 報名編號先以前端產生，未來可改成後端 API 回傳的正式編號。 */
  get applicationNo(): string {
    const submittedDate = new Date(this.submittedAt);
    const dateText = Number.isNaN(submittedDate.getTime())
      ? this.selectedSlotDate.replace(/\D/g, '').padEnd(8, '0').slice(0, 8)
      : `${submittedDate.getFullYear()}${String(submittedDate.getMonth() + 1).padStart(2, '0')}${String(submittedDate.getDate()).padStart(2, '0')}`;
    const marketSeed = (this.market?.title.length ?? 0) + this.totalFee;
    return `APP-${dateText}${String(marketSeed % 1000).padStart(3, '0')}`;
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
    return this.signup?.boothSpec || '3 × 3 公尺';
  }

  get selectedSlots(): MarketSlot[] {
    if (this.signup?.selectedSlots?.length) return this.signup.selectedSlots;
    return this.signup?.slot ? [this.signup.slot] : [];
  }

  get equipment(): CompleteEquipment[] {
    return this.signup?.equipment ?? [];
  }

  get powerOptions(): CompletePowerOption[] {
    return this.signup?.powerOptions ?? [];
  }

  get vehicleNumber(): string {
    return this.signup?.formData.vehicleNumber?.trim() || '無';
  }

  get hasVehicle(): boolean {
    return this.signup?.formData.hasVehicle ?? this.vehicleNumber !== '無';
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

  formatSlotDate(value: string): string {
    const year = this.market ? this.parseDate(this.market.start_date)?.getFullYear() : null;
    const normalized = /^\d{2}\/\d{2}$/.test(value) && year ? `${year}/${value}` : value;
    const parsed = this.parseDate(normalized);
    if (!parsed) return value;

    return `${parsed.getFullYear()}/${String(parsed.getMonth() + 1).padStart(2, '0')}/${String(parsed.getDate()).padStart(2, '0')}`;
  }

  private parseDate(value: string): Date | null {
    const normalized = value.replaceAll('/', '-');
    const parsed = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
