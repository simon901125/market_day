import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import {
  VendorApplicationSubmitRequest,
  VendorApplicationSubmitResponse,
} from '../../../../models/interface/vendor/VendorApplicationSubmit';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

interface ConfirmEquipment {
  id: string;
  name: string;
  detail: string;
  price: number;
  quantity: number;
  pricingUnit?: string | null;
}

interface ConfirmPowerOption {
  id: string;
  label: string;
  price: number;
  pricingUnit?: string | null;
}

interface SignupConfirmData {
  slot: MarketSlot | null;
  slotDate: string;
  selectedSlots?: MarketSlot[];
  categories: string[];
  equipment?: ConfirmEquipment[];
  powerOptions?: ConfirmPowerOption[];
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
  equipmentFee?: number;
  powerRentalFee: number;
  totalFee: number;
  applicationRequest: VendorApplicationSubmitRequest;
}

@Component({
  selector: 'app-vendor-signup-confirm-page',
  imports: [DecimalPipe, FormsModule, RouterLink, UserFooter, VendorHeader],
  templateUrl: './vendor-signup-confirm-page.html',
  styleUrl: './vendor-signup-confirm-page.scss',
})
export class VendorSignupConfirmPage {
  /** 從報名資料填寫頁帶入的市集資料。 */
  market: MarketCardItem | null = null;

  /** 從報名資料填寫頁帶入的表單與費用試算資料。 */
  signup: SignupConfirmData | null = null;

  agreed = true;
  isSubmitting = false;
  submitError = '';

  constructor(
    private readonly router: Router,
    private readonly vendorService: VendorService,
  ) {
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
    return this.signup?.boothSpec || '3 × 3 公尺';
  }

  get selectedSlots(): MarketSlot[] {
    if (this.signup?.selectedSlots?.length) return this.signup.selectedSlots;
    return this.signup?.slot ? [this.signup.slot] : [];
  }

  get selectedDays(): number {
    return Math.max(this.selectedSlots.length, 1);
  }

  get selectedEquipment(): ConfirmEquipment[] {
    return this.signup?.equipment ?? [];
  }

  get selectedPowerOptions(): ConfirmPowerOption[] {
    return this.signup?.powerOptions ?? [];
  }

  get categories(): string[] {
    return this.signup?.categories?.length ? this.signup.categories : (this.market?.tags ?? []);
  }

  /** 以下費用皆由表單頁試算結果帶入，確認頁只負責顯示。 */
  get boothFee(): number {
    return this.signup?.boothFee ?? this.market?.price ?? 0;
  }

  get boothFeePerDay(): number {
    return this.selectedDays ? this.boothFee / this.selectedDays : this.boothFee;
  }

  get boothDeposit(): number {
    return this.signup?.boothDeposit ?? 1000;
  }

  get equipmentFee(): number {
    return this.signup?.equipmentFee ?? 0;
  }

  get powerRentalFee(): number {
    return this.signup?.powerRentalFee ?? 0;
  }

  get totalFee(): number {
    return (
      this.signup?.totalFee ??
      this.boothFee + this.equipmentFee + this.powerRentalFee + this.boothDeposit
    );
  }

  get hasVehicle(): boolean {
    return this.signup?.formData.hasVehicle ?? this.vehicleNumber !== '無';
  }

  get vehicleNumber(): string {
    return this.signup?.formData.vehicleNumber?.trim() || '無';
  }

  get note(): string {
    return this.signup?.formData.note?.trim() || '無';
  }

  get signupStatusText(): string {
    return this.market?.status === '進行中' ? '報名中' : this.market?.status || '報名中';
  }

  get eventPeriodText(): string {
    if (!this.market) return '-';
    return `${this.market.start_date} - ${this.market.end_date}　${this.market.time}`;
  }

  get registrationPeriodText(): string {
    if (!this.market) return '-';
    const eventStart = this.parseDate(this.market.start_date);
    if (!eventStart) return '-';

    const registrationStart = new Date(eventStart);
    registrationStart.setDate(registrationStart.getDate() - 45);
    const registrationEnd = new Date(eventStart);
    registrationEnd.setDate(registrationEnd.getDate() - 22);

    return `${this.formatDateOnly(registrationStart)} 12:00 - ${this.formatDateOnly(registrationEnd)} 23:59`;
  }

  get eventDates(): string[] {
    if (!this.market) return ['-'];
    return [
      `${this.formatFullDate(this.market.start_date)}　${this.market.time}`,
      `${this.formatFullDate(this.market.end_date)}　${this.market.time}`,
    ];
  }

  get registrationDates(): string[] {
    if (!this.market) return ['-'];
    const eventStart = this.parseDate(this.market.start_date);
    if (!eventStart) return ['-'];

    const registrationStart = new Date(eventStart);
    registrationStart.setDate(registrationStart.getDate() - 45);
    const registrationEnd = new Date(eventStart);
    registrationEnd.setDate(registrationEnd.getDate() - 22);

    return [
      `${this.formatFullDateObject(registrationStart)}　12:00－`,
      `${this.formatFullDateObject(registrationEnd)}　23:59`,
    ];
  }

  formatSlotDate(value: string): string {
    const parsed = this.parseDate(value);
    if (!parsed && this.market && /^\d{2}\/\d{2}$/.test(value)) {
      const year = this.parseDate(this.market.start_date)?.getFullYear();
      return year ? this.formatFullDate(`${year}/${value}`) : value;
    }
    return parsed ? this.formatFullDateObject(parsed, false) : value;
  }

  powerVoltage(label: string): string {
    return label.split('/')[0]?.trim() || label;
  }

  powerWattage(label: string): string {
    return label.split('/')[1]?.trim() || '－';
  }

  equipmentItemTotal(item: ConfirmEquipment): number {
    return item.price * item.quantity * this.rentalUnits(item.pricingUnit);
  }

  rentalUnitLabel(pricingUnit?: string | null): string {
    const unitLabels: Record<string, string> = {
      EVENT: '場',
      DAY: '天',
      UNIT: '份',
    };
    return unitLabels[pricingUnit?.toUpperCase() ?? ''] ?? '天';
  }

  powerItemTotal(option: ConfirmPowerOption): number {
    return option.price * this.rentalUnits(option.pricingUnit);
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

  /** 呼叫後端建立報名資料，成功後才前往完成頁。 */
  submitApplication(): void {
    if (!this.agreed || this.isSubmitting) return;

    const request = this.signup?.applicationRequest;
    if (!request) {
      this.submitError = '找不到報名申請資料，請返回上一頁重新填寫。';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.vendorService.submitVendorApplication(request).subscribe({
      next: (response) => {
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          this.isSubmitting = false;
          this.submitError = response.messageDetails || response.message || '報名申請送出失敗。';
          return;
        }

        this.goToComplete(response.data);
      },
      error: (error: unknown) => {
        this.isSubmitting = false;
        this.submitError = this.getErrorMessage(error);
      },
    });
  }

  private goToComplete(application: VendorApplicationSubmitResponse): void {
    this.router.navigate(['/vendor/sign-up-complete'], {
      state: {
        market: this.market,
        signup: this.signup,
        application,
        submittedAt: new Date().toISOString(),
      },
    });
  }

  private getErrorMessage(error: unknown): string {
    if (typeof error !== 'object' || error === null) return '報名申請送出失敗，請稍後再試。';

    const responseError = (error as { error?: unknown }).error;
    if (typeof responseError !== 'object' || responseError === null) {
      return '報名申請送出失敗，請稍後再試。';
    }

    const message = (responseError as { message?: unknown; messageDetails?: unknown }).messageDetails
      ?? (responseError as { message?: unknown }).message;
    return typeof message === 'string' && message.trim()
      ? message
      : '報名申請送出失敗，請稍後再試。';
  }

  private parseDate(value: string): Date | null {
    const normalized = value.replaceAll('/', '-');
    const parsed = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private formatFullDate(value: string): string {
    const parsed = this.parseDate(value);
    return parsed ? this.formatFullDateObject(parsed) : value;
  }

  private formatFullDateObject(date: Date, includeYear = true): string {
    const dateText = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
    return `${includeYear ? `${date.getFullYear()}/` : ''}${dateText}（${weekday}）`;
  }

  private formatDateOnly(date: Date): string {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  }

  private rentalUnits(pricingUnit?: string | null): number {
    return pricingUnit?.toUpperCase() === 'EVENT' ? 1 : this.selectedDays;
  }
}
