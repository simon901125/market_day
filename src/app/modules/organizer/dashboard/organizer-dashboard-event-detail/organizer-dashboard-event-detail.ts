import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { BoothLayoutExampleModal } from '../modals/booth-layout-example-modal/booth-layout-example-modal';
import { BoothZoneModal, BoothZoneDraft } from '../modals/booth-zone-modal/booth-zone-modal';

interface EventForm {
  name: string;
  coverFileName: string;
  coverPreviewUrl: string;
  categories: string[];
  description: string;
  introduction: string;
}

interface EventTimeForm {
  eventStartDate: string;
  eventEndDate: string;
  eventStartTime: string;
  eventEndTime: string;
  registrationStartDate: string;
  registrationStartTime: string;
  registrationEndDate: string;
  registrationEndTime: string;
  confirmationDate: string;
  confirmationTime: string;
  metro: string;
  bus: string;
  driving: string;
}

interface VenueBoothForm {
  city: string;
  district: string;
  address: string;
  venueName: string;
  boothWidth: number | null;
  boothLength: number | null;
  boothHeight: number | null;
  totalBooths: number | null;
  boothPrice: number | null;
  layoutFileName: string;
  layoutPreviewUrl: string;
}

interface BoothZone {
  name: string;
  color: string;
  count: number;
}

interface FormStep {
  title: string;
  description: string;
}

@Component({
  selector: 'app-organizer-dashboard-event-detail',
  imports: [FormsModule, RouterLink, Dropdown, BoothZoneModal, BoothLayoutExampleModal],
  templateUrl: './organizer-dashboard-event-detail.html',
  styleUrl: './organizer-dashboard-event-detail.scss',
})
export class OrganizerDashboardEventDetail implements OnDestroy {
  currentStep = 0;
  showLayoutExample = false;
  showZoneDialog = false;
  editingZoneIndex: number | null = null;
  zoneDraft: BoothZoneDraft = {
    name: '',
    color: '#f97316',
    count: null,
  };

  /** 建立或編輯活動時顯示在左側的流程步驟。 */
  readonly steps: FormStep[] = [
    { title: '活動基本資料', description: '活動名稱、類型、介紹' },
    { title: '活動時間', description: '活動與報名時間設定' },
    { title: '活動場地與攤位規劃', description: '地點、地圖、攤位配置' },
  ];

  /** 活動類型選項，後續可改由共用類型或 API 提供。 */
  readonly categoryOptions = ['餐飲美食', '文創手作', '親子家庭', '寵物生活', '植物選物', '服飾配件', '玩具選物'];
  readonly cityOptions = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市'];
  readonly districtOptions = ['信義區', '中正區', '大安區', '松山區', '士林區', '內湖區'];
  readonly zoneColors = ['#f97316', '#65a30d', '#0ea5e9', '#8b5cf6', '#ec4899'];

  /** 活動基本資料表單暫存資料。 */
  form: EventForm = {
    name: '',
    coverFileName: '',
    coverPreviewUrl: '',
    categories: [],
    description: '',
    introduction: '',
  };

  /** 活動與報名時間、交通方式的表單暫存資料。 */
  timeForm: EventTimeForm = {
    eventStartDate: '',
    eventEndDate: '',
    eventStartTime: '',
    eventEndTime: '',
    registrationStartDate: '',
    registrationStartTime: '',
    registrationEndDate: '',
    registrationEndTime: '',
    confirmationDate: '',
    confirmationTime: '',
    metro: '',
    bus: '',
    driving: '',
  };

  venueForm: VenueBoothForm = {
    city: '',
    district: '',
    address: '',
    venueName: '',
    boothWidth: null,
    boothLength: null,
    boothHeight: null,
    totalBooths: null,
    boothPrice: null,
    layoutFileName: '',
    layoutPreviewUrl: '',
  };

  boothZones: BoothZone[] = [
    { name: 'A 區', color: '#f97316', count: 50 },
    { name: 'B 區', color: '#65a30d', count: 50 },
    { name: 'C 區', color: '#0ea5e9', count: 50 },
  ];

  /** 第一階段所有必填欄位都有內容時，才視為完成。 */
  get isBasicInfoComplete(): boolean {
    return Boolean(
      this.form.name.trim() &&
      this.form.coverPreviewUrl &&
      this.form.categories.length > 0 &&
      this.form.description.trim() &&
      this.form.introduction.trim()
    );
  }

  /** 第二階段的日期、時間，以及至少一種交通方式皆有填寫時才視為完成。 */
  get isTimeInfoComplete(): boolean {
    const requiredTimes = [
      this.timeForm.eventStartDate,
      this.timeForm.eventEndDate,
      this.timeForm.eventStartTime,
      this.timeForm.eventEndTime,
      this.timeForm.registrationStartDate,
      this.timeForm.registrationStartTime,
      this.timeForm.registrationEndDate,
      this.timeForm.registrationEndTime,
      this.timeForm.confirmationDate,
      this.timeForm.confirmationTime,
    ];
    const hasTransportation = [this.timeForm.metro, this.timeForm.bus, this.timeForm.driving]
      .some((value) => value.trim());

    return requiredTimes.every(Boolean) && hasTransportation;
  }

  isStepComplete(step: number): boolean {
    return (step === 0 && this.isBasicInfoComplete) || (step === 1 && this.isTimeInfoComplete);
  }

  goToStep(step: number): void {
    if (step >= 0 && step <= 2) {
      this.currentStep = step;
    }
  }

  goNext(): void {
    if (this.currentStep < 2) {
      this.currentStep += 1;
    }
  }

  openAddZoneDialog(): void {
    this.editingZoneIndex = null;
    this.zoneDraft = {
      name: '',
      color: '',
      count: null,
    };
    this.showZoneDialog = true;
  }

  openEditZoneDialog(index: number): void {
    const zone = this.boothZones[index];
    this.editingZoneIndex = index;
    this.zoneDraft = {
      name: zone.name.replace(/\s*區$/, ''),
      color: zone.color,
      count: zone.count,
    };
    this.showZoneDialog = true;
  }

  closeZoneDialog(): void {
    this.showZoneDialog = false;
    this.editingZoneIndex = null;
  }

  selectZoneColor(color: string): void {
    this.zoneDraft.color = color;
  }

  saveZoneDialog(): void {
    const normalizedName = this.zoneDraft.name.trim();
    const normalizedColor = this.zoneDraft.color.trim();

    if (!normalizedName || this.zoneDraft.count === null || !/^#[0-9A-Fa-f]{6}$/.test(normalizedColor)) {
      return;
    }

    const nextZone: BoothZone = {
      name: normalizedName.endsWith('區') ? normalizedName : `${normalizedName} 區`,
      color: normalizedColor.toUpperCase(),
      count: Math.max(0, Number(this.zoneDraft.count)),
    };

    if (this.editingZoneIndex === null) {
      this.boothZones = [...this.boothZones, nextZone];
    } else {
      this.boothZones = this.boothZones.map((zone, index) =>
        index === this.editingZoneIndex ? nextZone : zone
      );
    }

    this.closeZoneDialog();
  }

  removeBoothZone(index: number): void {
    this.boothZones = this.boothZones.filter((_, zoneIndex) => zoneIndex !== index);
    this.closeZoneDialog();
  }

  onLayoutSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.releaseLayoutPreview();
    this.venueForm.layoutFileName = file.name;
    if (file.type.startsWith('image/')) {
      this.venueForm.layoutPreviewUrl = URL.createObjectURL(file);
    }
  }

  removeLayout(input: HTMLInputElement): void {
    this.releaseLayoutPreview();
    this.venueForm.layoutFileName = '';
    input.value = '';
  }

  /** 切換活動類型的勾選狀態。 */
  toggleCategory(category: string): void {
    this.form.categories = this.isCategorySelected(category)
      ? this.form.categories.filter((item) => item !== category)
      : [...this.form.categories, category];
  }

  /** 判斷活動類型是否已被選取。 */
  isCategorySelected(category: string): boolean {
    return this.form.categories.includes(category);
  }

  /** 顯示使用者選擇的封面縮圖，之後可在此接上正式上傳流程。 */
  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.releaseCoverPreview();
    this.form.coverFileName = file.name;
    this.form.coverPreviewUrl = URL.createObjectURL(file);
  }

  /** 移除目前的封面，並清空檔案輸入，讓同一張圖片也能再次選取。 */
  removeCover(input: HTMLInputElement): void {
    this.releaseCoverPreview();
    this.form.coverFileName = '';
    input.value = '';
  }

  /** 元件離開畫面時釋放本機預覽網址，避免持續占用瀏覽器記憶體。 */
  ngOnDestroy(): void {
    this.releaseCoverPreview();
    this.releaseLayoutPreview();
  }

  /** 釋放目前的封面預覽網址。 */
  private releaseCoverPreview(): void {
    if (this.form.coverPreviewUrl) {
      URL.revokeObjectURL(this.form.coverPreviewUrl);
      this.form.coverPreviewUrl = '';
    }
  }

  private releaseLayoutPreview(): void {
    if (this.venueForm.layoutPreviewUrl) {
      URL.revokeObjectURL(this.venueForm.layoutPreviewUrl);
      this.venueForm.layoutPreviewUrl = '';
    }
  }
}
