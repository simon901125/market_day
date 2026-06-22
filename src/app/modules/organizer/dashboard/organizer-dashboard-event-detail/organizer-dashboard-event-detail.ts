import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { BoothLayoutExampleModal } from '../modals/booth-layout-example-modal/booth-layout-example-modal';
import { BoothZoneModal } from '../modals/booth-zone-modal/booth-zone-modal';
import { OrganizerEventRow } from '../../../../models/interface/organizer/OrganizerEventRow';
import { BoothZoneDraft } from '../../../../models/interface/organizer/BoothZoneDraft';
import { BoothZone, EventForm, EventTimeForm, FormStep, StatusAction, VenueBoothForm } from '../../../../models/interface/organizer/OrganizerEventEditor';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { Alert } from '../../../shared/alert';
import { TAIWAN_ADMINISTRATIVE_DIVISIONS, TAIWAN_CITY_OPTIONS } from '../../../../models/config/TaiwanAdministrativeDivisions';

@Component({
  selector: 'app-organizer-dashboard-event-detail',
  imports: [FormsModule, RouterLink, Dropdown, BoothZoneModal, BoothLayoutExampleModal],
  templateUrl: './organizer-dashboard-event-detail.html',
  styleUrl: './organizer-dashboard-event-detail.scss',
})
export class OrganizerDashboardEventDetail implements OnDestroy {
  readonly isViewMode: boolean;
  readonly isEditMode: boolean;
  readonly activityId: number;
  readonly editActivityId: number;
  readonly returnPage: number;
  readonly returnStatus: string;
  activity: OrganizerEventRow;
  feedbackMessage = '';
  currentStep = 0;
  submitAttempted = false;
  validationMessage = '';
  showLayoutExample = false;
  showZoneDialog = false;
  editingZoneIndex: number | null = null;
  private initialEditorSnapshot = '';
  private navigationAllowed = false;
  coverUploadError = '';
  layoutUploadError = '';
  isCoverDragging = false;
  isLayoutDragging = false;
  zoneDraft: BoothZoneDraft = {
    name: '',
    color: '#f97316',
    count: null,
  };

  /** 撱箇??楊頛舀暑??憿舐內?典椰?渡?瘚?甇仿???*/
  readonly steps: FormStep[] = [
    { title: '活動基本資料', description: '活動名稱、類型、介紹' },
    { title: '活動時間', description: '活動與報名時間設定' },
    { title: '活動場地與攤位規劃', description: '地點、地圖、攤位配置' },
  ];

  /** 瘣餃?憿??賊?嚗?蝥?寧?梁憿???API ????*/
  readonly categoryOptions = ['餐飲美食', '文創手作', '親子家庭', '寵物生活', '植物選物', '服飾配件', '玩具選物'];
  readonly cityOptions = TAIWAN_CITY_OPTIONS;
  readonly cityDistrictMap = TAIWAN_ADMINISTRATIVE_DIVISIONS;
  readonly zoneColors = ['#f97316', '#65a30d', '#0ea5e9', '#8b5cf6', '#ec4899'];
  readonly detailCategories = ['餐飲美食', '文創手作', '親子家庭', '植物選物'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alert: Alert,
  ) {
    this.activityId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editActivityId = Number(this.route.snapshot.queryParamMap.get('edit')) || 0;
    this.returnPage = Number(this.route.snapshot.queryParamMap.get('returnPage') || history.state?.returnPage) || 1;
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') || history.state?.returnStatus || '';
    this.isViewMode = this.activityId > 0;
    this.isEditMode = !this.isViewMode && this.editActivityId > 0;
    const stateActivity = history.state?.activity as OrganizerEventRow | undefined;
    this.activity = stateActivity ?? {
      id: this.activityId || 1,
      name: '夏日綠意市集',
      nameImage: 'assets/images/market/cards/market-card-01.png',
      date: '2026/06/15 - 2026/06/21',
      location: '台北市 信義區 草悟廣場',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    };

    if (this.isEditMode) {
      this.loadActivityIntoEditor();
    }

    this.initialEditorSnapshot = this.getEditorSnapshot();
  }

  get statusClass(): string {
    return ActivityStatus.getClass(this.activity.status);
  }

  get districtOptions(): string[] {
    return this.cityDistrictMap[this.venueForm.city] ?? [];
  }

  get eventDateTimeOrderInvalid(): boolean {
    return this.isDateTimeRangeInvalid(
      this.timeForm.eventStartDate,
      this.timeForm.eventStartTime,
      this.timeForm.eventEndDate,
      this.timeForm.eventEndTime,
    );
  }

  get registrationDateTimeOrderInvalid(): boolean {
    return this.isDateTimeRangeInvalid(
      this.timeForm.registrationStartDate,
      this.timeForm.registrationStartTime,
      this.timeForm.registrationEndDate,
      this.timeForm.registrationEndTime,
    );
  }

  get registrationEndAfterEventStart(): boolean {
    return this.isDateTimeAfter(
      this.timeForm.registrationEndDate,
      this.timeForm.registrationEndTime,
      this.timeForm.eventStartDate,
      this.timeForm.eventStartTime,
    );
  }

  get confirmationBeforeRegistrationEnd(): boolean {
    return this.isDateTimeBefore(
      this.timeForm.confirmationDate,
      this.timeForm.confirmationTime,
      this.timeForm.registrationEndDate,
      this.timeForm.registrationEndTime,
    );
  }

  get confirmationAfterEventStart(): boolean {
    return this.isDateTimeAfter(
      this.timeForm.confirmationDate,
      this.timeForm.confirmationTime,
      this.timeForm.eventStartDate,
      this.timeForm.eventStartTime,
      true,
    );
  }

  get boothZoneTotal(): number {
    return this.boothZones.reduce((total, zone) => total + Number(zone.count || 0), 0);
  }

  get boothZoneCountMismatch(): boolean {
    return this.isPositiveInteger(this.venueForm.totalBooths) &&
      this.boothZoneTotal !== Number(this.venueForm.totalBooths);
  }

  get availableActions(): StatusAction[] {
    switch (this.activity.status) {
      case ActivityStatus.draft:
        return [
          { key: 'delete', label: '刪除活動', variant: 'danger' },
          { key: 'edit', label: '編輯活動', variant: 'outline' },
          { key: 'submit', label: '送出審核', variant: 'primary' },
        ];
      case ActivityStatus.pendingReview:
        return [{ key: 'withdraw', label: '撤回申請', variant: 'outline' }];
      case ActivityStatus.revisionRequired:
        return [
          { key: 'edit', label: '編輯活動', variant: 'outline' },
          { key: 'resubmit', label: '重新送審', variant: 'primary' },
        ];
      case ActivityStatus.mapBuilding:
        return [];
      case ActivityStatus.readyToPublish:
        return [{ key: 'publish', label: '發布活動', variant: 'primary' }];
      case ActivityStatus.published:
      case ActivityStatus.registrationOpen:
      case ActivityStatus.full:
      case ActivityStatus.active:
        return [
          { key: 'unpublish', label: '下架活動', variant: 'danger' },
          { key: 'view', label: '查看活動頁面', variant: 'outline' },
        ];
      default:
        return [{ key: 'view', label: '查看活動頁面', variant: 'outline' }];
    }
  }

  async handleStatusAction(action: StatusAction): Promise<void> {
    this.feedbackMessage = '';
    switch (action.key) {
      case 'edit':
        this.router.navigate(['/organizer/dash-board/activity/detail'], {
          queryParams: { edit: this.activity.id, returnPage: this.returnPage, returnStatus: this.returnStatus || null },
          state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
        });
        return;
      case 'delete':
        if (!await this.alert.confirm(
          '刪除活動確認',
          `確定要刪除「${this.activity.name}」嗎？<br>此操作無法復原，所有活動資料將永久刪除。`,
          '確定刪除',
        )) {
          return;
        }
        await this.alert.success(
          '刪除活動成功',
          `活動「${this.activity.name}」已成功刪除。<br>所有資料將無法復原，感謝您的使用。`,
          '知道了',
        );
        this.router.navigate(['/organizer/dash-board/activity'], {
          queryParams: { page: this.returnPage, status: this.returnStatus || null },
        });
        return;
      case 'submit':
        if (!await this.alert.confirm(
          '送出審核確認',
          `確定要送出「${this.activity.name}」進行審核嗎？<br>送出後將無法編輯活動內容，需待審核結果。`,
          '確定送出',
        )) {
          return;
        }
        this.activity = { ...this.activity, status: ActivityStatus.pendingReview };
        await this.alert.success(
          '送出審核成功',
          '活動資料已送出審核，管理員將盡快為您審核。<br>審核結果將以通知信與站內通知告知您，謝謝！',
          '知道了',
        );
        return;
      case 'resubmit':
        if (!await this.alert.confirm(
          '重新送審確認',
          `確定要重新送審「${this.activity.name}」嗎？<br>重新送審後，審核流程將再次進行。`,
          '確定重新送審',
        )) {
          return;
        }
        this.activity = { ...this.activity, status: ActivityStatus.pendingReview };
        await this.alert.success(
          '重新送審成功',
          `活動「${this.activity.name}」已成功重新送審。<br>我們將盡快進行審核，結果將以通知告知您。`,
          '知道了',
        );
        return;
      case 'withdraw':
        if (!await this.alert.confirm(
          '撤回申請確認',
          `確定要撤回「${this.activity.name}」的審核申請嗎？<br>撤回後可再進行編輯，並重新送出審核。`,
          '確定撤回申請',
        )) {
          return;
        }
        this.activity = { ...this.activity, status: ActivityStatus.draft };
        await this.alert.success(
          '撤回申請成功',
          `已成功撤回「${this.activity.name}」的審核申請。<br>您現在可以進行編輯並重新送出審核。`,
          '知道了',
        );
        return;
      case 'publish':
        if (!await this.alert.confirm(
          '發布活動確認',
          `確定要發布「${this.activity.name}」嗎？<br>發布後活動將對外公開，所有人皆可瀏覽與報名。`,
          '確定發布',
        )) {
          return;
        }
        this.activity = { ...this.activity, status: ActivityStatus.registrationOpen };
        await this.alert.success(
          '發布活動成功',
          `活動「${this.activity.name}」已成功發布。<br>活動現已對外公開，所有人皆可瀏覽與報名。`,
          '知道了',
        );
        return;
      case 'unpublish':
        if (!await this.alert.confirm(
          '下架活動確認',
          `確定要下架「${this.activity.name}」嗎？<br>下架後，活動將不再對外公開，參加者將無法瀏覽與報名。`,
          '確定下架',
        )) {
          return;
        }
        this.activity = {
          ...this.activity,
          status: ActivityStatus.unpublished,
          signupProgress: '-',
          paidCount: '-',
        };
        await this.alert.success(
          '下架活動成功',
          `活動「${this.activity.name}」已成功下架。<br>活動現已不再對外公開，所有人皆不可瀏覽與報名。`,
          '知道了',
        );
        return;
      case 'view':
        this.router.navigate(['/user/activity-detail']);
    }
  }

  get zoneNamesForValidation(): string[] {
    return this.boothZones
      .filter((_, index) => index !== this.editingZoneIndex)
      .map((zone) => zone.name);
  }

  get zoneColorsForValidation(): string[] {
    return this.boothZones
      .filter((_, index) => index !== this.editingZoneIndex)
      .map((zone) => zone.color);
  }

  get totalErrorCount(): number {
    return this.steps.reduce((total, _, index) => total + this.getStepErrorCount(index), 0);
  }

  /** 瘣餃??箸鞈?銵典?怠?鞈???*/
  form: EventForm = {
    name: '',
    coverFileName: '',
    coverPreviewUrl: '',
    categories: [],
    description: '',
    introduction: '',
  };

  /** 瘣餃?????漱?撘?銵典?怠?鞈???*/
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

  /** 蝚砌??挾???憛急?雿?摰寞?嚗?閬摰???*/
  get isBasicInfoComplete(): boolean {
    return Boolean(
      this.form.name.trim() &&
      this.form.coverPreviewUrl &&
      this.form.categories.length > 0 &&
      this.form.description.trim() &&
      this.form.introduction.trim()
    );
  }

  /** 蝚砌??挾?????隞亙?銝車鈭日撘??‵撖急????箏???*/
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
      .every((value) => value.trim());

    return requiredTimes.every(Boolean) && hasTransportation &&
      !this.eventDateTimeOrderInvalid &&
      !this.registrationDateTimeOrderInvalid &&
      !this.registrationEndAfterEventStart &&
      !this.confirmationBeforeRegistrationEnd &&
      !this.confirmationAfterEventStart;
  }

  get isVenueInfoComplete(): boolean {
    return Boolean(
      this.venueForm.city &&
      this.venueForm.district &&
      this.venueForm.address.trim() &&
      this.venueForm.venueName.trim() &&
      this.isPositiveNumber(this.venueForm.boothLength) &&
      this.isPositiveNumber(this.venueForm.boothWidth) &&
      this.isPositiveNumber(this.venueForm.boothHeight) &&
      this.isPositiveInteger(this.venueForm.totalBooths) &&
      this.isNonNegativeNumber(this.venueForm.boothPrice) &&
      this.boothZones.length > 0 &&
      !this.boothZoneCountMismatch &&
      this.venueForm.layoutFileName
    );
  }

  isStepComplete(step: number): boolean {
    return (
      (step === 0 && this.isBasicInfoComplete) ||
      (step === 1 && this.isTimeInfoComplete) ||
      (step === 2 && this.isVenueInfoComplete)
    );
  }

  getStepErrorCount(step: number): number {
    if (step === 0) {
      return [
        !this.form.name.trim(),
        !this.form.coverPreviewUrl,
        this.form.categories.length === 0,
        !this.form.description.trim(),
        !this.form.introduction.trim(),
      ].filter(Boolean).length;
    }

    if (step === 1) {
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
      const missingTimes = requiredTimes.filter((value) => !value).length;
      const missingTransportation = [this.timeForm.metro, this.timeForm.bus, this.timeForm.driving]
        .filter((value) => !value.trim()).length;
      const dateLogicErrors = [
        this.eventDateTimeOrderInvalid,
        this.registrationDateTimeOrderInvalid,
        this.registrationEndAfterEventStart,
        this.confirmationBeforeRegistrationEnd,
        this.confirmationAfterEventStart,
      ].filter(Boolean).length;
      return missingTimes + missingTransportation + dateLogicErrors;
    }

    return [
      !this.venueForm.city,
      !this.venueForm.district,
      !this.venueForm.address.trim(),
      !this.venueForm.venueName.trim(),
      !this.isPositiveNumber(this.venueForm.boothLength),
      !this.isPositiveNumber(this.venueForm.boothWidth),
      !this.isPositiveNumber(this.venueForm.boothHeight),
      !this.isPositiveInteger(this.venueForm.totalBooths),
      !this.isNonNegativeNumber(this.venueForm.boothPrice),
      this.boothZones.length === 0,
      this.boothZoneCountMismatch,
      !this.venueForm.layoutFileName,
    ].filter(Boolean).length;
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

  selectCity(city: string): void {
    if (this.venueForm.city !== city) {
      this.venueForm.city = city;
      this.venueForm.district = '';
    }
  }

  async saveDraft(): Promise<void> {
    this.activity = {
      ...this.activity,
      name: this.form.name.trim() || this.activity.name,
      nameImage: this.form.coverPreviewUrl || this.activity.nameImage,
      status: ActivityStatus.draft,
    };
    this.initialEditorSnapshot = this.getEditorSnapshot();

    await this.alert.success(
      '儲存草稿成功',
      '活動資料已儲存為草稿，您可以稍後再繼續編輯。',
      '知道了',
    );

    const detailActivityId = this.isEditMode ? this.editActivityId : this.activity.id;
    this.navigationAllowed = true;
    this.router.navigate(['/organizer/dash-board/activity/detail', detailActivityId], {
      queryParams: { returnPage: this.returnPage, returnStatus: this.returnStatus || null },
      state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
    });
  }

  async cancelEditor(): Promise<void> {
    if (this.hasUnsavedChanges && !await this.alert.confirm(
      '尚有未儲存的變更',
      '離開後，本次尚未儲存的內容將會遺失。確定要離開嗎？',
      '確定離開',
    )) {
      return;
    }

    this.navigationAllowed = true;
    this.navigateFromEditor();
  }

  canDeactivate(): boolean | Promise<boolean> {
    if (this.isViewMode || this.navigationAllowed || !this.hasUnsavedChanges) {
      return true;
    }

    return this.alert.confirm(
      '尚有未儲存的變更',
      '離開後，本次尚未儲存的內容將會遺失。確定要離開嗎？',
      '確定離開',
    );
  }

  @HostListener('window:beforeunload', ['$event'])
  preventUnsavedRefresh(event: BeforeUnloadEvent): void {
    if (!this.isViewMode && this.hasUnsavedChanges && !this.navigationAllowed) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  private navigateFromEditor(): void {
    if (this.isEditMode) {
      this.router.navigate(['/organizer/dash-board/activity/detail', this.editActivityId], {
        queryParams: { returnPage: this.returnPage, returnStatus: this.returnStatus || null },
        state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
      });
      return;
    }

    this.router.navigate(['/organizer/dash-board/activity'], {
      queryParams: { page: this.returnPage, status: this.returnStatus || null },
    });
  }

  async submitForReview(): Promise<void> {
    this.submitAttempted = true;
    const firstInvalidStep = this.steps.findIndex((_, index) => this.getStepErrorCount(index) > 0);

    if (firstInvalidStep === -1) {
      this.validationMessage = '';
      const eventName = this.form.name.trim() || this.activity.name;
      const confirmed = await this.alert.confirm(
        '送出審核確認',
        `確定要送出「${eventName}」進行審核嗎？<br>送出後將無法編輯活動內容，需待審核結果。`,
        '確定送出',
      );

      if (!confirmed) {
        return;
      }

      this.activity = {
        ...this.activity,
        name: eventName,
        nameImage: this.form.coverPreviewUrl || this.activity.nameImage,
        status: ActivityStatus.pendingReview,
      };
      this.initialEditorSnapshot = this.getEditorSnapshot();

      await this.alert.success(
        '送出審核成功',
        '活動資料已送出審核，管理員將盡快為您審核。<br>審核結果將以通知信與站內通知告知您，謝謝！',
        '知道了',
      );

      if (this.isEditMode) {
        this.navigationAllowed = true;
        this.router.navigate(['/organizer/dash-board/activity/detail', this.editActivityId], {
          queryParams: { returnPage: this.returnPage, returnStatus: this.returnStatus || null },
          state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
        });
      } else {
        this.navigationAllowed = true;
        this.router.navigate(['/organizer/dash-board/activity'], {
          queryParams: { page: this.returnPage, status: this.returnStatus || null },
        });
      }
      return;
    }

    this.validationMessage = '活動資料尚未填寫完整';
    this.currentStep = firstInvalidStep;

    setTimeout(() => {
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  saveZoneDialog(): void {
    const normalizedName = this.zoneDraft.name.trim();
    const normalizedColor = this.zoneDraft.color.trim();

    const normalizedCount = Number(this.zoneDraft.count);
    const normalizedZoneName = normalizedName.replace(/\s*區$/, '').trim().toLocaleLowerCase();
    const hasDuplicateName = this.zoneNamesForValidation.some(
      (name) => name.replace(/\s*區$/, '').trim().toLocaleLowerCase() === normalizedZoneName
    );
    const hasDuplicateColor = this.zoneColorsForValidation.some(
      (color) => color.trim().toUpperCase() === normalizedColor.toUpperCase()
    );
    if (
      !normalizedName ||
      !Number.isInteger(normalizedCount) ||
      normalizedCount < 1 ||
      !/^#[0-9A-Fa-f]{6}$/.test(normalizedColor) ||
      hasDuplicateName ||
      hasDuplicateColor
    ) {
      return;
    }

    const nextZone: BoothZone = {
      name: normalizedName.endsWith('區') ? normalizedName : `${normalizedName} 區`,
      color: normalizedColor.toUpperCase(),
      count: normalizedCount,
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

  async removeBoothZone(index: number): Promise<void> {
    const zone = this.boothZones[index];
    const confirmed = await this.alert.confirm(
      '刪除攤位分區確認',
      `確定要刪除「${zone.name}」嗎？<br>刪除後需重新新增才能復原。`,
      '確定刪除',
    );

    if (!confirmed) {
      return;
    }

    this.boothZones = this.boothZones.filter((_, zoneIndex) => zoneIndex !== index);
    this.closeZoneDialog();
  }

  onLayoutSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    this.processLayoutFile(file, input);
  }

  onLayoutDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isLayoutDragging = true;
  }

  onLayoutDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isLayoutDragging = false;
  }

  onLayoutDrop(event: DragEvent, input: HTMLInputElement): void {
    event.preventDefault();
    this.isLayoutDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processLayoutFile(file, input);
    }
  }

  removeLayout(input: HTMLInputElement): void {
    this.releaseLayoutPreview();
    this.venueForm.layoutFileName = '';
    this.layoutUploadError = '';
    input.value = '';
  }

  /** ??瘣餃?憿???貊???*/
  toggleCategory(category: string): void {
    this.form.categories = this.isCategorySelected(category)
      ? this.form.categories.filter((item) => item !== category)
      : [...this.form.categories, category];
  }

  /** ?斗瘣餃?憿??臬撌脰◤?詨???*/
  isCategorySelected(category: string): boolean {
    return this.form.categories.includes(category);
  }

  /** 憿舐內雿輻???撠蝮桀?嚗?敺?冽迨?乩?甇??銝瘚???*/
  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    this.processCoverFile(file, input);
  }

  onCoverDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isCoverDragging = true;
  }

  onCoverDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isCoverDragging = false;
  }

  onCoverDrop(event: DragEvent, input: HTMLInputElement): void {
    event.preventDefault();
    this.isCoverDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processCoverFile(file, input);
    }
  }

  /** 蝘駁?桀????ｇ?銝行?蝛箸?獢撓?伐?霈?銝撘萄????賢?甈⊿??*/
  removeCover(input: HTMLInputElement): void {
    this.releaseCoverPreview();
    this.form.coverFileName = '';
    this.coverUploadError = '';
    input.value = '';
  }

  /** ?辣?ａ??恍???暹璈?閬賜雯?嚗??蝥??函汗?刻??園???*/
  ngOnDestroy(): void {
    this.releaseCoverPreview();
    this.releaseLayoutPreview();
  }

  /** ??桀????ａ?閬賜雯???*/
  private releaseCoverPreview(): void {
    if (this.form.coverPreviewUrl) {
      if (this.form.coverPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.form.coverPreviewUrl);
      }
      this.form.coverPreviewUrl = '';
    }
  }

  private releaseLayoutPreview(): void {
    if (this.venueForm.layoutPreviewUrl) {
      if (this.venueForm.layoutPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.venueForm.layoutPreviewUrl);
      }
      this.venueForm.layoutPreviewUrl = '';
    }
  }

  private processCoverFile(file: File, input: HTMLInputElement): void {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.coverUploadError = '活動封面僅支援 JPG、PNG 圖片';
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.coverUploadError = '活動封面檔案不可超過 5 MB';
      input.value = '';
      return;
    }

    this.releaseCoverPreview();
    this.coverUploadError = '';
    this.form.coverFileName = file.name;
    this.form.coverPreviewUrl = URL.createObjectURL(file);
  }

  private processLayoutFile(file: File, input: HTMLInputElement): void {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.layoutUploadError = '攤位配置圖僅支援 JPG、PNG 圖片';
      input.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.layoutUploadError = '攤位配置圖檔案不可超過 10 MB';
      input.value = '';
      return;
    }

    this.releaseLayoutPreview();
    this.layoutUploadError = '';
    this.venueForm.layoutFileName = file.name;
    this.venueForm.layoutPreviewUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : '';
  }

  private loadActivityIntoEditor(): void {
    this.form = {
      name: this.activity.name,
      coverFileName: this.activity.nameImage.split('/').pop() ?? '活動封面',
      coverPreviewUrl: this.activity.nameImage,
      categories: [...this.detailCategories],
      description: '結合手作選物、風格餐飲與親子互動體驗，打造適合週末散步與逛市集的城市綠意空間。',
      introduction: '本活動邀請多組在地品牌與特色攤位參與，提供美食、文創、植物與生活選物等內容，讓民眾能在輕鬆氛圍中認識不同品牌故事。',
    };

    this.timeForm = {
      eventStartDate: '2026-06-15',
      eventEndDate: '2026-06-21',
      eventStartTime: '10:00',
      eventEndTime: '18:00',
      registrationStartDate: '2026-04-01',
      registrationStartTime: '10:00',
      registrationEndDate: '2026-05-31',
      registrationEndTime: '23:59',
      confirmationDate: '2026-06-10',
      confirmationTime: '12:00',
      metro: '捷運站步行約 8 分鐘',
      bus: '公車站下車後步行約 3 分鐘',
      driving: '附近設有收費停車場，請依現場指示停放',
    };

    this.venueForm = {
      city: this.activity.location.slice(0, 3),
      district: this.activity.location.split(' ')[1] || '信義區',
      address: this.activity.location,
      venueName: this.activity.location.split(' ').at(-1) ?? '活動場地',
      boothWidth: 3,
      boothLength: 3,
      boothHeight: 2.5,
      totalBooths: 150,
      boothPrice: 2500,
      layoutFileName: 'booth-layout-example.svg',
      layoutPreviewUrl: 'assets/images/organizer/booth-layout-example.svg',
    };
  }

  private get hasUnsavedChanges(): boolean {
    return this.getEditorSnapshot() !== this.initialEditorSnapshot;
  }

  private getEditorSnapshot(): string {
    return JSON.stringify({
      form: this.form,
      timeForm: this.timeForm,
      venueForm: this.venueForm,
      boothZones: this.boothZones,
    });
  }

  private isPositiveNumber(value: number | null): boolean {
    return value !== null && Number.isFinite(Number(value)) && Number(value) > 0;
  }

  private isPositiveInteger(value: number | null): boolean {
    return value !== null && Number.isInteger(Number(value)) && Number(value) > 0;
  }

  private isNonNegativeNumber(value: number | null): boolean {
    return value !== null && Number.isFinite(Number(value)) && Number(value) >= 0;
  }

  private isDateTimeRangeInvalid(startDate: string, startTime: string, endDate: string, endTime: string): boolean {
    if (!startDate || !startTime || !endDate || !endTime) {
      return false;
    }
    return this.toDateTime(endDate, endTime) <= this.toDateTime(startDate, startTime);
  }

  private isDateTimeAfter(
    date: string,
    time: string,
    comparisonDate: string,
    comparisonTime: string,
    allowEqual = false,
  ): boolean {
    if (!date || !time || !comparisonDate || !comparisonTime) {
      return false;
    }
    const value = this.toDateTime(date, time);
    const comparison = this.toDateTime(comparisonDate, comparisonTime);
    return allowEqual ? value >= comparison : value > comparison;
  }

  private isDateTimeBefore(date: string, time: string, comparisonDate: string, comparisonTime: string): boolean {
    if (!date || !time || !comparisonDate || !comparisonTime) {
      return false;
    }
    return this.toDateTime(date, time) < this.toDateTime(comparisonDate, comparisonTime);
  }

  private toDateTime(date: string, time: string): number {
    return new Date(`${date}T${time}:00`).getTime();
  }
}
