import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TAIWAN_ADMINISTRATIVE_DIVISIONS, TAIWAN_CITY_OPTIONS } from '../../../../models/config/TaiwanAdministrativeDivisions';

interface OrganizerProfileForm {
  organizerName: string;
  contactName: string;
  phone: string;
  email: string;
  companyName: string;
  taxId: string;
  city: string;
  district: string;
  address: string;
  weekdays: string[];
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-organizer-profile-modal',
  imports: [FormsModule],
  templateUrl: './organizer-profile-modal.html',
  styleUrl: './organizer-profile-modal.scss',
})
export class OrganizerProfileModal implements OnChanges, OnDestroy {
  private readonly closeAnimationMs = 180;
  private closeTimer?: number;

  @Input() name = '';
  @Input() email = '';
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<OrganizerProfileForm>();

  isClosing = false;

  readonly cityOptions = TAIWAN_CITY_OPTIONS;
  readonly cityDistrictMap = TAIWAN_ADMINISTRATIVE_DIVISIONS;
  readonly weekdayOptions = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];

  form: OrganizerProfileForm = this.createForm();

  get districtOptions(): string[] {
    return this.cityDistrictMap[this.form.city] ?? [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open']?.currentValue) {
      this.isClosing = false;
      this.clearCloseTimer();
      this.form = this.createForm();
      return;
    }

    if ((changes['name'] || changes['email']) && this.open) {
      this.form = this.createForm();
    }
  }

  toggleWeekday(day: string, checked: boolean): void {
    if (checked) {
      this.form.weekdays = Array.from(new Set([...this.form.weekdays, day]));
      return;
    }

    this.form.weekdays = this.form.weekdays.filter((item) => item !== day);
  }

  isWeekdaySelected(day: string): boolean {
    return this.form.weekdays.includes(day);
  }

  onCityChange(city: string): void {
    this.form.city = city;
    this.form.district = this.districtOptions[0] ?? '';
  }

  save(): void {
    this.saved.emit({ ...this.form, weekdays: [...this.form.weekdays] });
    this.close();
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

    this.isClosing = true;
    this.closeTimer = window.setTimeout(() => {
      this.closed.emit();
      this.isClosing = false;
      this.closeTimer = undefined;
    }, this.closeAnimationMs);
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
  }

  private createForm(): OrganizerProfileForm {
    const defaultCity = '台北市';
    const defaultDistrict = '大安區';

    return {
      organizerName: '森林生活市集',
      contactName: this.name || '主辦方',
      phone: '0912-345-678',
      email: this.email || '',
      companyName: '森林生活工作室',
      taxId: '98765432',
      city: defaultCity,
      district: defaultDistrict,
      address: '忠孝東路四段123號5樓',
      weekdays: ['週一', '週二', '週三', '週四', '週五'],
      startTime: '09:00',
      endTime: '18:00',
    };
  }

  private clearCloseTimer(): void {
    if (this.closeTimer) {
      window.clearTimeout(this.closeTimer);
      this.closeTimer = undefined;
    }
  }
}
