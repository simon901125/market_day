import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';

@Component({
  selector: 'app-vendor-signup-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './vendor-signup-form.html',
  styleUrl: './vendor-signup-form.scss',
})
export class VendorSignupForm {
  /** 從市集詳細頁透過 Router state 帶入的市集資料。 */
  market: MarketCardItem | null = null;

  /** 目前選擇的報名場次，預設使用第一個場次。 */
  selectedSlotIndex = 0;

  /** 使用者勾選的攤位類別；key 是類別名稱，value 是是否勾選。 */
  selectedCategories: Record<string, boolean> = {};

  /** 表單補充欄位，使用 ngModel 做雙向資料綁定。 */
  formData = {
    powerUsage: '',
    vehicleNumber: '',
    note: '',
    rentPower: true,
  };

  /** 攤位固定資訊，畫面與確認頁都會使用同一份資料。 */
  readonly boothSpec = '2*3米 / 2.7*3米 / 1.5米';
  readonly boothDeposit = 1000;
  readonly powerRentalFee = 50;

  /** 當市集資料沒有 tags 時，表單使用這組預設攤位類別。 */
  readonly defaultCategories = ['餐飲美食', '文創手作', '親子家庭', '寵物生活', '服飾配件', '玩具禮物', '植物選物'];

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;

    // 從 detail 頁帶入使用者已選擇的場次，讓表單頁維持同一個選取狀態。
    const stateIndex = navigation?.extras.state?.['selectedSlotIndex'] ?? history.state?.['selectedSlotIndex'];
    if (typeof stateIndex === 'number' && stateIndex >= 0 && stateIndex < this.slots.length) {
      this.selectedSlotIndex = stateIndex;
    }
  }

  /** 市集日期區間文字，集中處理可避免 template 重複組字串。 */
  get dateRangeText(): string {
    if (!this.market) return '-';
    return `${this.market.start_date} - ${this.market.end_date}`;
  }

  /** 報名截止日暫以活動開始日前 14 天計算；日期格式錯誤時改用 end_date。 */
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

  /** 場次列表從 market.slots 綁定；沒有資料時回傳空陣列避免 template 報錯。 */
  get slots() {
    return this.market?.slots ?? [];
  }

  /** 目前選取的場次，用於主內容與右側摘要同步顯示。 */
  get selectedSlot() {
    return this.slots[this.selectedSlotIndex] ?? null;
  }

  /** 目前選取場次的日期文字；沒有場次時使用市集開始日。 */
  get selectedSlotDate(): string {
    return this.selectedSlot?.date || this.market?.start_date || '-';
  }

  /** 攤位類別優先使用 market.tags，沒有 tags 時使用預設類別。 */
  get categoryOptions(): string[] {
    return this.market?.tags?.length ? this.market.tags : this.defaultCategories;
  }

  /** 取得使用者已勾選的攤位類別，確認頁會直接顯示這份資料。 */
  get selectedCategoryList(): string[] {
    return Object.entries(this.selectedCategories)
      .filter(([, checked]) => checked)
      .map(([category]) => category);
  }

  /** 攤位費用由 market.price 帶入，沒有資料時以 0 顯示。 */
  get boothFee(): number {
    return this.market?.price ?? 0;
  }

  /** 是否收取電力租借費，依使用者勾選狀態即時計算。 */
  get selectedPowerRentalFee(): number {
    return this.formData.rentPower ? this.powerRentalFee : 0;
  }

  /** 費用總計會隨市集費用與設備租借勾選狀態自動更新。 */
  get totalFee(): number {
    return this.boothFee + this.boothDeposit + this.selectedPowerRentalFee;
  }

  /** 剩餘攤位加總所有場次剩餘數，供右側摘要顯示。 */
  get remainingBooths(): number {
    return this.slots.reduce((total, slot) => total + slot.remaining, 0);
  }

  /** 供 template 判斷目前場次是否為選取狀態。 */
  isSelectedSlot(index: number): boolean {
    return this.selectedSlotIndex === index;
  }

  /** 使用者切換場次時同步更新主內容與右側摘要。 */
  selectSlot(index: number): void {
    this.selectedSlotIndex = index;
  }

  /** 回到市集詳細頁時，一樣把 market 帶回去，避免詳細頁資料遺失。 */
  backToDetail(): void {
    this.router.navigate(['/vendor/sign-up-detail'], {
      state: { market: this.market },
    });
  }

  /** 前往確認頁，將市集資料、選取場次、表單資料與費用試算一起帶入。 */
  goToConfirm(): void {
    this.router.navigate(['/vendor/sign-up-confirm'], {
      state: {
        market: this.market,
        signup: {
          slot: this.selectedSlot,
          slotDate: this.selectedSlotDate,
          categories: this.selectedCategoryList,
          formData: this.formData,
          boothSpec: this.boothSpec,
          boothFee: this.boothFee,
          boothDeposit: this.boothDeposit,
          powerRentalFee: this.selectedPowerRentalFee,
          totalFee: this.totalFee,
        },
      },
    });
  }
}
