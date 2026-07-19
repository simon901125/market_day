import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { AddressApiService } from '../../../../../core/services/address-api.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { OrganizerApiService } from '../../../../../core/services/organizer-api.service';
import {
  OrganizerProfile,
  OrganizerProfileForm,
  OrganizerProfileSaveRequest,
} from '../../../../../models/interface/organizer/OrganizerProfile';
import { isApiSuccessStatus } from '../../../../../models/interface/shared/ApiResult';
import { Dropdown } from '../../../../shared/dropdown/dropdown';

type OrganizerProfileField =
  | 'organizerName'
  | 'contactName'
  | 'contactPhone'
  | 'contactEmail'
  | 'taxId'
  | 'city'
  | 'district'
  | 'address'
  | 'serviceDays'
  | 'serviceTime';

@Component({
  selector: 'app-organizer-profile-modal',
  imports: [FormsModule, Dropdown],
  templateUrl: './organizer-profile-modal.html',
  styleUrl: './organizer-profile-modal.scss',
})
export class OrganizerProfileModal implements OnChanges, OnDestroy {
  private readonly closeAnimationMs = 180;
  private closeTimer?: number;
  private profileLoadId = 0;
  private profileSaveId = 0;
  private districtLoadId = 0;

  @Input() name = '';
  @Input() email = '';
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<OrganizerProfileForm>();

  isClosing = false;
  isLoadingProfile = false;
  isSavingProfile = false;
  validationErrors: Partial<Record<OrganizerProfileField, string>> = {};

  cityOptions: string[] = [];
  districtOptions: string[] = [];
  readonly weekdayOptions = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

  form: OrganizerProfileForm = this.createForm();

  constructor(
    private readonly addressApiService: AddressApiService,
    private readonly organizerApiService: OrganizerApiService,
    private readonly alert: AlertService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      this.isClosing = false;
      this.clearCloseTimer();
      this.form = this.createForm();
      this.validationErrors = {};
      void this.loadProfile();
      return;
    }

    if ((changes['name'] || changes['email']) && this.open) {
      this.form = this.createForm();
    }
  }

  toggleWeekday(day: string, checked: boolean): void {
    this.clearValidationError('serviceDays');
    if (checked) {
      this.form.serviceDays = Array.from(new Set([...this.form.serviceDays, day]));
      return;
    }

    this.form.serviceDays = this.form.serviceDays.filter((item) => item !== day);
  }

  isWeekdaySelected(day: string): boolean {
    return this.form.serviceDays.includes(day);
  }

  onCityChange(city: string): void {
    this.form.city = city;
    this.form.district = '';
    this.clearValidationError('city');
    this.clearValidationError('district');
    void this.loadDistrictOptions(city);
  }

  onDistrictChange(district: string): void {
    this.form.district = district;
    this.clearValidationError('district');
  }

  clearValidationError(field: OrganizerProfileField): void {
    if (!this.validationErrors[field]) {
      return;
    }

    const { [field]: _removed, ...remainingErrors } = this.validationErrors;
    this.validationErrors = remainingErrors;
  }

  clearServiceTimeError(): void {
    this.clearValidationError('serviceTime');
  }

  async save(): Promise<void> {
    if (this.isLoadingProfile || this.isSavingProfile) {
      return;
    }

    if (!this.validateForm()) {
      window.setTimeout(() => {
        const firstInvalidControl = document.querySelector<HTMLElement>(
          '.organizer-profile-modal .has-error input, .organizer-profile-modal .has-error button',
        );
        firstInvalidControl?.focus();
        firstInvalidControl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    const saveId = ++this.profileSaveId;
    this.isSavingProfile = true;

    try {
      const response = await firstValueFrom(
        this.organizerApiService.postOrganizerProfile(this.createSaveRequest()),
      );
      if (saveId !== this.profileSaveId || !this.open) {
        return;
      }

      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        await this.alert.error('儲存失敗', response.message || '無法儲存主辦方資料，請檢查後再試。');
        return;
      }

      this.form = this.createForm(response.data);
      this.validationErrors = {};
      this.saved.emit({ ...this.form, serviceDays: [...this.form.serviceDays] });
      this.close();
    } catch {
      if (saveId === this.profileSaveId && this.open) {
        await this.alert.error('儲存失敗', '無法儲存主辦方資料，請稍後再試。');
      }
    } finally {
      if (saveId === this.profileSaveId) {
        this.isSavingProfile = false;
      }
    }
  }

  closeFromBackdrop(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    if (this.isClosing) {
      return;
    }

    this.profileLoadId += 1;
    this.profileSaveId += 1;
    this.districtLoadId += 1;
    this.isLoadingProfile = false;
    this.isSavingProfile = false;
    this.isClosing = true;
    this.closeTimer = window.setTimeout(() => {
      this.closed.emit();
      this.isClosing = false;
      this.closeTimer = undefined;
    }, this.closeAnimationMs);
  }

  ngOnDestroy(): void {
    this.profileLoadId += 1;
    this.profileSaveId += 1;
    this.districtLoadId += 1;
    this.clearCloseTimer();
  }

  private async loadProfile(): Promise<void> {
    const loadId = ++this.profileLoadId;
    this.isLoadingProfile = true;

    try {
      const [response, cityResponse] = await Promise.all([
        firstValueFrom(this.organizerApiService.getOrganizerProfile()),
        firstValueFrom(this.addressApiService.getAddressCities()),
      ]);
      if (loadId !== this.profileLoadId || !this.open) {
        return;
      }

      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        await this.alert.error('載入失敗', response.message || '無法載入主辦方資料，請稍後再試。');
        return;
      }

      if (!isApiSuccessStatus(cityResponse.statusCode) || !cityResponse.data) {
        await this.alert.error('載入失敗', cityResponse.message || '無法取得縣市資料，請稍後再試。');
        return;
      }

      this.cityOptions = cityResponse.data;
      this.form = this.createForm(response.data);
      if (!this.cityOptions.includes(this.form.city)) {
        this.form.city = this.cityOptions[0] ?? '';
      }
      await this.loadDistrictOptions(this.form.city, this.form.district, loadId);
      this.validationErrors = {};
    } catch {
      if (loadId === this.profileLoadId && this.open) {
        await this.alert.error('載入失敗', '無法載入主辦方資料，請稍後再試。');
      }
    } finally {
      if (loadId === this.profileLoadId) {
        this.isLoadingProfile = false;
      }
    }
  }

  private createForm(profile?: OrganizerProfile): OrganizerProfileForm {
    return {
      organizerName: profile?.organizerName?.trim() || '',
      contactName: profile?.contactName?.trim() || this.name || '',
      contactPhone: profile?.contactPhone?.trim() || '',
      contactEmail: profile?.contactEmail?.trim() || this.email || '',
      companyName: profile?.companyName?.trim() || '',
      taxId: profile?.taxId?.trim() || '',
      city: profile?.city?.trim() || '',
      district: profile?.district?.trim() || '',
      address: profile?.address?.trim() || '',
      serviceDays: this.parseServiceDays(profile?.serviceDays),
      serviceStartTime: this.normalizeTime(profile?.serviceStartTime),
      serviceEndTime: this.normalizeTime(profile?.serviceEndTime),
    };
  }

  private async loadDistrictOptions(
    city: string,
    preferredDistrict = '',
    profileLoadId?: number,
  ): Promise<void> {
    const districtLoadId = ++this.districtLoadId;
    this.districtOptions = [];

    if (!city) {
      this.form.district = '';
      return;
    }

    try {
      const response = await firstValueFrom(
        this.addressApiService.getAddressDistricts(city),
      );
      if (
        districtLoadId !== this.districtLoadId
        || !this.open
        || (profileLoadId !== undefined && profileLoadId !== this.profileLoadId)
      ) {
        return;
      }

      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        await this.alert.error('載入失敗', response.message || '無法取得行政區資料，請稍後再試。');
        return;
      }

      this.districtOptions = response.data;
      this.form.district = this.districtOptions.includes(preferredDistrict)
        ? preferredDistrict
        : this.districtOptions[0] ?? '';
    } catch {
      if (districtLoadId === this.districtLoadId && this.open) {
        await this.alert.error('載入失敗', '無法取得行政區資料，請稍後再試。');
      }
    }
  }

  private parseServiceDays(serviceDays: string | null | undefined): string[] {
    if (!serviceDays) {
      return [];
    }

    const labelsByCode: Record<string, string> = {
      MON: '週一',
      TUE: '週二',
      WED: '週三',
      THU: '週四',
      FRI: '週五',
      SAT: '週六',
      SUN: '週日',
    };

    return serviceDays
      .split(',')
      .map((day) => day.trim())
      .map((day) => labelsByCode[day.toUpperCase()] ?? day)
      .filter((day) => this.weekdayOptions.includes(day));
  }

  private normalizeTime(time: string | null | undefined): string {
    return time?.trim().slice(0, 5) || '';
  }

  private createSaveRequest(): OrganizerProfileSaveRequest {
    const codesByLabel: Record<string, string> = {
      週一: 'MON',
      週二: 'TUE',
      週三: 'WED',
      週四: 'THU',
      週五: 'FRI',
      週六: 'SAT',
      週日: 'SUN',
    };

    return {
      organizerName: this.form.organizerName.trim(),
      contactName: this.form.contactName.trim(),
      contactPhone: this.form.contactPhone.trim(),
      contactEmail: this.form.contactEmail.trim(),
      companyName: this.form.companyName.trim(),
      taxId: this.form.taxId.trim(),
      city: this.form.city.trim(),
      district: this.form.district.trim(),
      address: this.form.address.trim(),
      serviceDays: this.form.serviceDays.map((day) => codesByLabel[day]).filter(Boolean).join(','),
      serviceStartTime: this.form.serviceStartTime,
      serviceEndTime: this.form.serviceEndTime,
    };
  }

  private validateForm(): boolean {
    const errors: Partial<Record<OrganizerProfileField, string>> = {};
    const phone = this.form.contactPhone.trim();
    const email = this.form.contactEmail.trim();
    const taxId = this.form.taxId.trim();

    if (!this.form.organizerName.trim()) {
      errors.organizerName = '請輸入主辦方名稱';
    }
    if (!this.form.contactName.trim()) {
      errors.contactName = '請輸入聯絡人姓名';
    }
    if (!phone) {
      errors.contactPhone = '請輸入聯絡電話';
    } else if (!/^[0-9()+\-\s]{8,20}$/.test(phone) || phone.replace(/\D/g, '').length < 8) {
      errors.contactPhone = '請輸入有效的聯絡電話';
    }
    if (!email) {
      errors.contactEmail = '請輸入聯絡電子郵件';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.contactEmail = '請輸入有效的電子郵件格式';
    }
    if (taxId && !/^\d{8}$/.test(taxId)) {
      errors.taxId = '統一編號須為 8 碼數字';
    }
    if (!this.form.city.trim()) {
      errors.city = '請選擇縣市';
    }
    if (!this.form.district.trim()) {
      errors.district = '請選擇行政區';
    }
    if (!this.form.address.trim()) {
      errors.address = '請輸入聯絡地址';
    }
    if (this.form.serviceDays.length === 0) {
      errors.serviceDays = '請至少選擇一個服務星期';
    }
    if (!this.form.serviceStartTime || !this.form.serviceEndTime) {
      errors.serviceTime = '請選擇完整的服務起訖時間';
    } else if (this.form.serviceEndTime <= this.form.serviceStartTime) {
      errors.serviceTime = '結束時間必須晚於開始時間';
    }

    this.validationErrors = errors;
    return Object.keys(errors).length === 0;
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }
}
