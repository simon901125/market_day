import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

interface RentalEquipment {
  id: string;
  name: string;
  detail: string;
  price: number;
  selected: boolean;
  quantity: number;
  maxQuantity: number;
}

interface PowerOption {
  id: string;
  label: string;
  price: number;
  selected: boolean;
}

@Component({
  selector: 'app-vendor-signup-form',
  imports: [DecimalPipe, FormsModule, RouterLink, UserFooter, VendorHeader],
  templateUrl: './vendor-signup-form.html',
  styleUrl: './vendor-signup-form.scss',
})
export class VendorSignupForm {
  /** 從市集詳細頁透過 Router state 帶入的市集資料。 */
  market: MarketCardItem | null = null;

  /** 詳細頁已整理好的場次，避免 market 本身沒有 slots 時跨頁遺失。 */
  private routedSlots: MarketSlot[] = [];

  /** 報名日期採複選，key 為場次日期。 */
  selectedDates: Record<string, boolean> = {};

  /** 設備租借資料集中管理，數量與勾選狀態會同步更新右側摘要。 */
  equipment: RentalEquipment[] = [
    {
      id: 'table',
      name: '桌子',
      detail: '180 × 60 公分',
      price: 100,
      selected: true,
      quantity: 1,
      maxQuantity: 3,
    },
    {
      id: 'chair',
      name: '椅子',
      detail: '一般塑膠椅',
      price: 50,
      selected: true,
      quantity: 2,
      maxQuantity: 6,
    },
    {
      id: 'extension',
      name: '延長線',
      detail: '5 公尺',
      price: 50,
      selected: false,
      quantity: 0,
      maxQuantity: 2,
    },
    {
      id: 'fan',
      name: '電風扇',
      detail: '',
      price: 100,
      selected: false,
      quantity: 0,
      maxQuantity: 2,
    },
    {
      id: 'light',
      name: '照明燈',
      detail: 'LED 投光燈 100W',
      price: 200,
      selected: false,
      quantity: 0,
      maxQuantity: 2,
    },
  ];

  /** 額外用電選項與費用由資料綁定產生。 */
  powerOptions: PowerOption[] = [
    { id: 'power110', label: '110V / 1000W', price: 200, selected: true },
    { id: 'power220', label: '220V / 2000W', price: 400, selected: true },
  ];

  requiresExtraPower = true;
  validationAttempted = false;

  /** 車輛與備註欄位使用雙向綁定，之後可直接轉為 API payload。 */
  formData = {
    hasVehicle: true,
    vehicleNumber: '',
    note: '',
  };

  readonly boothSpec = '3 × 3 公尺';
  readonly boothDeposit = 1000;
  readonly capacityPerDate = 200;
  readonly noteMaxLength = 200;

  constructor(private readonly router: Router) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;
    const stateSlots = navigation?.extras.state?.['slots'] ?? history.state?.['slots'];
    this.routedSlots = Array.isArray(stateSlots) ? stateSlots : [];

    const signupState = navigation?.extras.state?.['signup'] ?? history.state?.['signup'];
    const restoredSlots = Array.isArray(signupState?.selectedSlots)
      ? (signupState.selectedSlots as MarketSlot[])
      : [];

    this.initializeSelectedDates(restoredSlots);
  }

  get slots(): MarketSlot[] {
    if (this.market?.slots?.length) {
      return this.market.slots;
    }

    if (this.routedSlots.length) {
      return this.routedSlots;
    }

    return this.buildFallbackSlots();
  }

  get selectedSlots(): MarketSlot[] {
    return this.slots.filter((slot) => this.selectedDates[slot.date]);
  }

  get selectedDays(): number {
    return this.selectedSlots.length;
  }

  get selectedSlot(): MarketSlot | null {
    return this.selectedSlots[0] ?? null;
  }

  get selectedSlotDate(): string {
    return this.selectedSlot?.date ?? this.market?.start_date ?? '-';
  }

  get boothFeePerDay(): number {
    return this.market?.price ?? 650;
  }

  get boothSubtotal(): number {
    return this.boothFeePerDay * this.selectedDays;
  }

  get selectedEquipment(): RentalEquipment[] {
    return this.equipment.filter((item) => item.selected && item.quantity > 0);
  }

  get equipmentDailySubtotal(): number {
    return this.selectedEquipment.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  get equipmentSubtotal(): number {
    return this.equipmentDailySubtotal * this.selectedDays;
  }

  get selectedPowerOptions(): PowerOption[] {
    return this.requiresExtraPower ? this.powerOptions.filter((option) => option.selected) : [];
  }

  get powerDailySubtotal(): number {
    return this.selectedPowerOptions.reduce((total, option) => total + option.price, 0);
  }

  get powerSubtotal(): number {
    return this.powerDailySubtotal * this.selectedDays;
  }

  get totalFee(): number {
    return this.boothSubtotal + this.equipmentSubtotal + this.powerSubtotal + this.boothDeposit;
  }

  get showDateError(): boolean {
    return this.validationAttempted && !this.selectedDays;
  }

  get showPowerError(): boolean {
    return this.validationAttempted && this.requiresExtraPower && !this.selectedPowerOptions.length;
  }

  get showVehicleNumberError(): boolean {
    return this.validationAttempted && this.formData.hasVehicle && !this.formData.vehicleNumber.trim();
  }

  get registrationPeriod(): string {
    if (!this.market) {
      return '-';
    }

    const start = this.parseDate(this.market.start_date);
    if (!start) {
      return '-';
    }

    const registrationStart = new Date(start);
    registrationStart.setDate(registrationStart.getDate() - 45);
    const registrationEnd = new Date(start);
    registrationEnd.setDate(registrationEnd.getDate() - 22);

    return `${this.formatFullDate(registrationStart)} 12:00 - ${this.formatFullDate(registrationEnd)} 23:59`;
  }

  get signupStatusText(): string {
    return this.market?.status === '進行中' ? '報名中' : this.market?.status || '報名中';
  }

  get categoryOptions(): string[] {
    return this.market?.tags?.length
      ? this.market.tags
      : ['文創手作', '寵物生活', '植物選物', '生活選物'];
  }

  /** 切換日期時至少保留畫面狀態，送出前再統一驗證。 */
  toggleDate(slot: MarketSlot): void {
    this.selectedDates[slot.date] = !this.selectedDates[slot.date];
  }

  /** 切換設備後同步調整數量，避免勾選設備卻維持 0。 */
  toggleEquipment(item: RentalEquipment): void {
    item.selected = !item.selected;
    item.quantity = item.selected ? Math.max(1, item.quantity) : 0;
  }

  changeEquipmentQuantity(item: RentalEquipment, delta: number): void {
    const nextQuantity = Math.min(item.maxQuantity, Math.max(0, item.quantity + delta));

    item.quantity = nextQuantity;
    item.selected = nextQuantity > 0;
  }

  formatSlotDate(date: string): string {
    const parsed = this.parseDate(date);
    if (!parsed) {
      return date;
    }

    return `${String(parsed.getMonth() + 1).padStart(2, '0')}/${String(parsed.getDate()).padStart(2, '0')}（${this.weekday(parsed)}）`;
  }

  formatEventDate(date: string): string {
    const parsed = this.parseDate(date);
    return parsed ? this.formatFullDate(parsed) : date;
  }

  backToDetail(): void {
    this.router.navigate(['/vendor/sign-up-detail'], {
      state: { market: this.market },
    });
  }

  /** 驗證必填資料後，帶著完整報名 payload 前往確認頁。 */
  goToConfirm(): void {
    this.validationAttempted = true;

    if (this.showDateError || this.showPowerError || this.showVehicleNumberError) {
      this.scrollToFirstError();
      return;
    }

    this.router.navigate(['/vendor/sign-up-confirm'], {
      state: {
        market: this.market,
        signup: {
          slot: this.selectedSlot,
          slotDate: this.selectedSlotDate,
          selectedSlots: this.selectedSlots,
          categories: this.categoryOptions,
          equipment: this.selectedEquipment,
          powerOptions: this.selectedPowerOptions,
          formData: {
            powerUsage: this.selectedPowerOptions.map((option) => option.label).join('、') || '無',
            vehicleNumber: this.formData.hasVehicle ? this.formData.vehicleNumber.trim() : '無',
            note: this.formData.note,
            rentPower: this.requiresExtraPower,
            hasVehicle: this.formData.hasVehicle,
          },
          boothSpec: this.boothSpec,
          boothFee: this.boothSubtotal,
          boothDeposit: this.boothDeposit,
          equipmentFee: this.equipmentSubtotal,
          powerRentalFee: this.powerSubtotal,
          totalFee: this.totalFee,
        },
      },
    });
  }

  private scrollToFirstError(): void {
    setTimeout(() => {
      const firstError = document.querySelector<HTMLElement>('[data-validation-error="true"]');
      if (!firstError) return;

      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const focusTarget = firstError.matches('input, button, select, textarea')
        ? firstError
        : firstError.querySelector<HTMLElement>('input, button, select, textarea');
      focusTarget?.focus({ preventScroll: true });
    });
  }

  private initializeSelectedDates(restoredSlots: MarketSlot[]): void {
    const restoredDates = new Set(restoredSlots.map((slot) => slot.date));

    this.slots.forEach((slot) => {
      if (restoredDates.size) {
        this.selectedDates[slot.date] = restoredDates.has(slot.date);
        return;
      }

      this.selectedDates[slot.date] = true;
    });
  }

  private buildFallbackSlots(): MarketSlot[] {
    if (!this.market) return [];

    const start = this.parseDate(this.market.start_date);
    const end = this.parseDate(this.market.end_date);
    if (!start || !end || end < start) return [];

    const slots: MarketSlot[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      slots.push({
        date: `${String(cursor.getMonth() + 1).padStart(2, '0')}/${String(cursor.getDate()).padStart(2, '0')}`,
        remaining: this.capacityPerDate,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return slots;
  }

  private parseDate(value: string): Date | null {
    const parts = value.match(/\d+/g)?.map(Number) ?? [];
    let year: number;
    let month: number;
    let day: number;

    if (parts.length >= 3) {
      [year, month, day] = parts;
    } else if (parts.length === 2) {
      const marketYear = this.market?.start_date.match(/\d{4}/)?.[0];
      year = Number(marketYear) || new Date().getFullYear();
      [month, day] = parts;
    } else {
      return null;
    }

    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private formatFullDate(date: Date): string {
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  }

  private weekday(date: Date): string {
    return ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
  }
}
