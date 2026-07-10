import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { BoothLayoutExampleModal } from '../modals/booth-layout-example-modal/booth-layout-example-modal';
import { BoothZoneModal } from '../modals/booth-zone-modal/booth-zone-modal';
import { OrganizerEventRow } from '../../../../models/interface/organizer/OrganizerEventRow';
import { BoothZoneDraft } from '../../../../models/interface/organizer/BoothZoneDraft';
import {
  BoothZone,
  EventEquipment,
  EventEquipmentDraft,
  EventForm,
  EventPowerPlan,
  EventPowerPlanDraft,
  EventTimeForm,
  FormStep,
  StatusAction,
  VenueBoothForm,
} from '../../../../models/interface/organizer/OrganizerEventEditor';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { AlertService } from '../../../../core/services/alert.service';
import { TAIWAN_ADMINISTRATIVE_DIVISIONS, TAIWAN_CITY_OPTIONS } from '../../../../models/config/TaiwanAdministrativeDivisions';

@Component({
  selector: 'app-organizer-dashboard-event-detail',
  imports: [FormsModule, RouterLink, Dropdown, BoothZoneModal, BoothLayoutExampleModal],
  templateUrl: './organizer-dashboard-event-detail.html',
  styleUrl: './organizer-dashboard-event-detail.scss',
})
export class OrganizerDashboardEventDetail implements OnDestroy {
  /** 是否為查看活動詳情模式。 */
  readonly isViewMode: boolean;

  /** 是否為編輯既有活動模式。 */
  readonly isEditMode: boolean;

  /** 路由上的活動 ID，用於查看詳情。 */
  readonly activityId: number;

  /** query string 上的編輯活動 ID，用於草稿或補件編輯。 */
  readonly editActivityId: number;

  /** 返回活動管理列表時要保留的頁碼。 */
  readonly returnPage: number;

  /** 返回活動管理列表時要保留的狀態篩選。 */
  readonly returnStatus: string;

  /** 目前顯示或編輯的活動資料。 */
  activity: OrganizerEventRow;

  /** 顯示在頁面上的操作回饋訊息。 */
  feedbackMessage = '';

  /** 建立／編輯活動目前所在步驟。 */
  currentStep = 0;

  /** 是否已嘗試送出審核，用來控制驗證樣式顯示。 */
  submitAttempted = false;

  /** 表單送審失敗時的整體提示文字。 */
  validationMessage = '';

  /** 是否顯示攤位配置圖範例 Modal。 */
  showLayoutExample = false;

  /** 攤位配置圖範例 Modal 是否正在退場。 */
  isLayoutExampleClosing = false;

  /** 是否顯示新增／編輯攤位分區 Modal。 */
  showZoneDialog = false;

  /** 攤位分區 Modal 是否正在退場。 */
  isZoneDialogClosing = false;

  /** 是否顯示新增／編輯設備 Modal。 */
  showEquipmentDialog = false;

  /** 設備 Modal 是否正在退場。 */
  isEquipmentDialogClosing = false;

  /** 是否顯示新增／編輯基本用電 Modal。 */
  showBasicPowerDialog = false;

  /** 基本用電 Modal 是否正在退場。 */
  isBasicPowerDialogClosing = false;

  /** 是否顯示新增／編輯額外用電方案 Modal。 */
  showExtraPowerDialog = false;

  /** 額外用電 Modal 是否正在退場。 */
  isExtraPowerDialogClosing = false;

  /** 目前正在編輯的攤位分區索引，null 代表新增。 */
  editingZoneIndex: number | null = null;

  /** 目前正在編輯的設備索引，null 代表新增。 */
  editingEquipmentIndex: number | null = null;

  /** 目前正在編輯的基本用電索引，null 代表新增。 */
  editingBasicPowerIndex: number | null = null;

  /** 目前正在編輯的額外用電方案索引，null 代表新增。 */
  editingExtraPowerIndex: number | null = null;

  /** 初始表單快照，用來判斷是否有未儲存變更。 */
  private initialEditorSnapshot = '';

  /** 程式主動導頁時略過未儲存防護。 */
  private navigationAllowed = false;

  /** Modal 退場動畫時間，需和帳號設定 modal 一致。 */
  private readonly modalCloseDelay = 180;

  /** 活動封面上傳錯誤訊息。 */
  coverUploadError = '';

  /** 攤位配置圖上傳錯誤訊息。 */
  layoutUploadError = '';

  /** 活動封面拖曳上傳區是否處於拖曳狀態。 */
  isCoverDragging = false;

  /** 攤位配置圖拖曳上傳區是否處於拖曳狀態。 */
  isLayoutDragging = false;

  /** 攤位分區 Modal 使用的暫存資料。 */
  zoneDraft: BoothZoneDraft = {
    name: '',
    color: '#f97316',
    count: null,
  };

  /** 設備 Modal 使用的暫存資料。 */
  equipmentDraft: EventEquipmentDraft = this.createEmptyEquipmentDraft();

  /** 用電 Modal 使用的暫存資料。 */
  powerPlanDraft: EventPowerPlanDraft = this.createEmptyPowerPlanDraft();

  /** 是否提供設備租借。 */
  providesEquipmentRental = true;

  /** 是否提供基本免費用電。 */
  providesBasicPower = true;

  /** 是否開放額外申請用電。 */
  allowsExtraPower = true;

  /** 設備清單。 */
  equipmentItems: EventEquipment[] = [];

  /** 基本免費用電方案。 */
  basicPowerPlans: EventPowerPlan[] = [];

  /** 額外申請用電方案。 */
  extraPowerPlans: EventPowerPlan[] = [];

  /** 左側步驟導覽顯示內容。 */
  readonly steps: FormStep[] = [
    { title: '活動基本資料', description: '活動名稱、類型、介紹' },
    { title: '活動時間', description: '活動與報名時間設定' },
    { title: '活動場地與攤位規劃', description: '地點、地圖、攤位配置' },
    { title: '活動設備與用電設定', description: '設備提供、設備租借、用電設定' },
  ];

  /** 活動類型選項，之後可改由 API 取得。 */
  readonly categoryOptions = ['餐飲美食', '文創手作', '親子家庭', '寵物生活', '植物選物', '服飾配件', '玩具選物'];

  /** 台灣縣市選項。 */
  readonly cityOptions = TAIWAN_CITY_OPTIONS;

  /** 縣市與行政區對照表。 */
  readonly cityDistrictMap = TAIWAN_ADMINISTRATIVE_DIVISIONS;

  /** 攤位分區預設色票。 */
  readonly zoneColors = ['#f97316', '#65a30d', '#0ea5e9', '#8b5cf6', '#ec4899'];

  /** 查看／編輯詳情時帶入的活動類型。 */
  detailCategories = ['餐飲美食', '文創手作', '親子家庭', '植物選物'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly alert: AlertService,
  ) {
    this.activityId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editActivityId = Number(this.route.snapshot.queryParamMap.get('edit')) || 0;
    this.returnPage = Number(this.route.snapshot.queryParamMap.get('returnPage') || history.state?.returnPage) || 1;
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') || history.state?.returnStatus || '';
    this.isViewMode = this.activityId > 0;
    this.isEditMode = !this.isViewMode && this.editActivityId > 0;
    const stateActivity = history.state?.activity as OrganizerEventRow | undefined;
    this.activity = stateActivity ?? this.getFallbackActivity(this.activityId);

    if (this.isViewMode || this.isEditMode) {
      this.loadActivityIntoEditor();
    }

    this.initialEditorSnapshot = this.getEditorSnapshot();
  }

  private getFallbackActivity(activityId: number): OrganizerEventRow {
    if (activityId === 15) {
      return {
        id: 15,
        name: '草稿測試市集',
        nameImage: 'assets/images/shared/no-image-placeholder.svg',
        date: '-',
        location: '尚未填寫',
        status: ActivityStatus.draft,
        signupProgress: '-',
        paidCount: '-',
        actionLabel: '查看詳情',
      };
    }

    return {
      id: activityId || 1,
      name: '夏日綠意市集',
      nameImage: 'assets/images/market/cards/market-card-01.png',
      date: '2026/06/15 - 2026/06/21',
      location: '台北市 信義區 草悟廣場',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    };
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

  get isEquipmentPowerComplete(): boolean {
    const equipmentReady = !this.providesEquipmentRental || this.equipmentItems.length > 0;
    const basicPowerReady = !this.providesBasicPower || this.basicPowerPlans.length > 0;
    const extraPowerReady = !this.allowsExtraPower || this.extraPowerPlans.length > 0;
    return equipmentReady && basicPowerReady && extraPowerReady;
  }

  get availableActions(): StatusAction[] {
    switch (this.activity.status) {
      case ActivityStatus.draft:
        return [
          { key: 'edit', label: '編輯', variant: 'outline' },
          { key: 'submit', label: '送出審核', variant: 'primary' },
          { key: 'delete', label: '刪除', variant: 'danger' },
        ];
      case ActivityStatus.pendingReview:
        return [
          { key: 'withdraw', label: '撤回申請', variant: 'outline' },
          { key: 'view', label: '查看詳情', variant: 'outline' },
        ];
      case ActivityStatus.revisionRequired:
        return [
          { key: 'edit', label: '編輯', variant: 'outline' },
          { key: 'resubmit', label: '重新送審', variant: 'primary' },
        ];
      case ActivityStatus.mapBuilding:
        return [{ key: 'view', label: '查看', variant: 'outline' }];
      case ActivityStatus.readyToPublish:
        return [
          { key: 'publish', label: '發布活動', variant: 'primary' },
          { key: 'view', label: '查看詳情', variant: 'outline' },
        ];
      case ActivityStatus.registrationOpen:
      case ActivityStatus.full:
        return [
          { key: 'unpublish', label: '下架活動', variant: 'danger' },
          { key: 'view', label: '查看詳情', variant: 'outline' },
        ];
      default:
        return [{ key: 'view', label: '查看詳情', variant: 'outline' }];
    }
  }

  /** 依據狀態按鈕執行送審、發布、下架、刪除等操作。 */
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

  /** Modal 驗證用：排除目前編輯中的分區後，取得既有分區名稱。 */
  get zoneNamesForValidation(): string[] {
    return this.boothZones
      .filter((_, index) => index !== this.editingZoneIndex)
      .map((zone) => zone.name);
  }

  /** Modal 驗證用：排除目前編輯中的分區後，取得既有分區顏色。 */
  get zoneColorsForValidation(): string[] {
    return this.boothZones
      .filter((_, index) => index !== this.editingZoneIndex)
      .map((zone) => zone.color);
  }

  /** 全部步驟的錯誤總數，用於送審失敗提示。 */
  get totalErrorCount(): number {
    return this.steps.reduce((total, _, index) => total + this.getStepErrorCount(index), 0);
  }

  /** 目前步驟的錯誤總數，用於決定送審失敗提示文案。 */
  get currentStepErrorCount(): number {
    return this.getStepErrorCount(this.currentStep);
  }

  /** 送審失敗時顯示的提示文案，會依目前步驟是否仍有錯誤調整。 */
  get validationSummaryText(): string {
    if (this.currentStepErrorCount > 0) {
      return `${this.validationMessage}，本步驟尚有 ${this.currentStepErrorCount} 項需要確認。請確認下方紅框欄位。`;
    }

    return `${this.validationMessage}，其他步驟尚有 ${this.totalErrorCount} 項需要確認。請點選左側紅色提示步驟補齊資料。`;
  }

  /** 第一步：活動基本資料表單。 */
  form: EventForm = {
    name: '',
    coverFileName: '',
    coverPreviewUrl: '',
    categories: [],
    description: '',
    introduction: '',
  };

  /** 第二步：活動與報名時間、交通方式表單。 */
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

  /** 第三步：活動場地與攤位規劃表單。 */
  venueForm: VenueBoothForm = {
    city: '',
    district: '',
    address: '',
    venueName: '',
    boothWidth: null,
    boothLength: null,
    totalBooths: null,
    boothPrice: null,
    layoutFileName: '',
    layoutPreviewUrl: '',
  };

  /** 攤位分區清單，新增與編輯 Modal 都會更新這份資料。 */
  boothZones: BoothZone[] = [
    { name: 'A 區', color: '#f97316', count: 50 },
    { name: 'B 區', color: '#65a30d', count: 50 },
    { name: 'C 區', color: '#0ea5e9', count: 50 },
  ];

  /** 第一步必填欄位是否都已完成。 */
  get isBasicInfoComplete(): boolean {
    return Boolean(
      this.form.name.trim() &&
      this.form.coverPreviewUrl &&
      this.form.categories.length > 0 &&
      this.form.description.trim() &&
      this.form.introduction.trim()
    );
  }

  /** 第二步必填欄位是否都已完成，並檢查日期時間邏輯。 */
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

  /** 第三步必填欄位是否都已完成，並檢查分區總數是否吻合攤位總數。 */
  get isVenueInfoComplete(): boolean {
    return Boolean(
      this.venueForm.city &&
      this.venueForm.district &&
      this.venueForm.address.trim() &&
      this.venueForm.venueName.trim() &&
      this.isPositiveNumber(this.venueForm.boothLength) &&
      this.isPositiveNumber(this.venueForm.boothWidth) &&
      this.isPositiveInteger(this.venueForm.totalBooths) &&
      this.isNonNegativeNumber(this.venueForm.boothPrice) &&
      this.boothZones.length > 0 &&
      !this.boothZoneCountMismatch &&
      this.venueForm.layoutFileName
    );
  }

  /** 判斷指定步驟是否完成，供左側步驟狀態使用。 */
  isStepComplete(step: number): boolean {
    return (
      (step === 0 && this.isBasicInfoComplete) ||
      (step === 1 && this.isTimeInfoComplete) ||
      (step === 2 && this.isVenueInfoComplete) ||
      (step === 3 && this.isEquipmentPowerComplete)
    );
  }

  /** 計算指定步驟還有幾個驗證錯誤。 */
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

    if (step === 2) {
      return [
        !this.venueForm.city,
        !this.venueForm.district,
        !this.venueForm.address.trim(),
        !this.venueForm.venueName.trim(),
        !this.isPositiveNumber(this.venueForm.boothLength),
        !this.isPositiveNumber(this.venueForm.boothWidth),
        !this.isPositiveInteger(this.venueForm.totalBooths),
        !this.isNonNegativeNumber(this.venueForm.boothPrice),
        this.boothZones.length === 0,
        this.boothZoneCountMismatch,
        !this.venueForm.layoutFileName,
      ].filter(Boolean).length;
    }

    return [
      this.providesEquipmentRental && this.equipmentItems.length === 0,
      this.providesBasicPower && this.basicPowerPlans.length === 0,
      this.allowsExtraPower && this.extraPowerPlans.length === 0,
    ].filter(Boolean).length;
  }

  /** 切換目前編輯步驟。 */
  goToStep(step: number): void {
    if (step >= 0 && step < this.steps.length) {
      this.currentStep = step;
    }
  }

  /** 前往下一步。 */
  goNext(): void {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep += 1;
    }
  }

  /** 開啟新增攤位分區 Modal，並清空暫存資料。 */
  openAddZoneDialog(): void {
    this.editingZoneIndex = null;
    this.isZoneDialogClosing = false;
    this.zoneDraft = {
      name: '',
      color: '',
      count: null,
    };
    this.showZoneDialog = true;
  }

  /** 開啟編輯攤位分區 Modal，並把既有資料帶入暫存資料。 */
  openEditZoneDialog(index: number): void {
    const zone = this.boothZones[index];
    this.editingZoneIndex = index;
    this.isZoneDialogClosing = false;
    this.zoneDraft = {
      name: zone.name.replace(/\s*區$/, ''),
      color: zone.color,
      count: zone.count,
    };
    this.showZoneDialog = true;
  }

  /** 關閉攤位分區 Modal 並重置編輯索引。 */
  closeZoneDialog(): void {
    if (!this.showZoneDialog || this.isZoneDialogClosing) {
      return;
    }

    this.isZoneDialogClosing = true;
    window.setTimeout(() => {
      this.showZoneDialog = false;
      this.isZoneDialogClosing = false;
      this.editingZoneIndex = null;
    }, this.modalCloseDelay);
  }

  /** 從色票或 HEX 輸入更新分區顏色。 */
  selectZoneColor(color: string): void {
    this.zoneDraft.color = color;
  }

  /** 選擇縣市後清空行政區，避免保留不屬於該縣市的行政區。 */
  selectCity(city: string): void {
    if (this.venueForm.city !== city) {
      this.venueForm.city = city;
      this.venueForm.district = '';
    }
  }

  /** 儲存草稿並回到詳情查看狀態。 */
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

  /** 取消建立／編輯，若有未儲存變更會先提示確認。 */
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

  /** 路由離開守衛使用，防止未儲存資料被直接離開。 */
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

  /** 瀏覽器重新整理或關閉分頁時，提醒尚有未儲存變更。 */
  @HostListener('window:beforeunload', ['$event'])
  preventUnsavedRefresh(event: BeforeUnloadEvent): void {
    if (!this.isViewMode && this.hasUnsavedChanges && !this.navigationAllowed) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  /** 依建立或編輯模式決定取消後返回哪個頁面。 */
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

  /** 送出審核前執行全部步驟驗證，通過後顯示確認與成功提示。 */
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

  /** 儲存新增或編輯後的攤位分區。 */
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

  /** 刪除攤位分區前先顯示確認提示。 */
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

  openAddEquipmentDialog(): void {
    this.editingEquipmentIndex = null;
    this.isEquipmentDialogClosing = false;
    this.equipmentDraft = this.createEmptyEquipmentDraft();
    this.showEquipmentDialog = true;
  }

  openEditEquipmentDialog(index: number): void {
    this.editingEquipmentIndex = index;
    this.isEquipmentDialogClosing = false;
    this.equipmentDraft = { ...this.equipmentItems[index] };
    this.showEquipmentDialog = true;
  }

  closeEquipmentDialog(): void {
    if (!this.showEquipmentDialog || this.isEquipmentDialogClosing) {
      return;
    }

    this.isEquipmentDialogClosing = true;
    window.setTimeout(() => {
      this.showEquipmentDialog = false;
      this.isEquipmentDialogClosing = false;
      this.editingEquipmentIndex = null;
    }, this.modalCloseDelay);
  }

  saveEquipmentDialog(): void {
    const nextEquipment = this.normalizeEquipmentDraft();
    if (!nextEquipment) {
      return;
    }

    if (this.editingEquipmentIndex === null) {
      this.equipmentItems = [...this.equipmentItems, nextEquipment];
    } else {
      this.equipmentItems = this.equipmentItems.map((item, index) =>
        index === this.editingEquipmentIndex ? nextEquipment : item
      );
    }

    this.closeEquipmentDialog();
  }

  async removeEquipment(index: number): Promise<void> {
    const equipment = this.equipmentItems[index];
    if (!await this.alert.confirm(
      '刪除設備確認',
      `確定要刪除「${equipment.name}」嗎？<br>刪除後需重新新增才能復原。`,
      '確定刪除',
    )) {
      return;
    }

    this.equipmentItems = this.equipmentItems.filter((_, itemIndex) => itemIndex !== index);
  }

  openAddBasicPowerDialog(): void {
    this.editingBasicPowerIndex = null;
    this.isBasicPowerDialogClosing = false;
    this.powerPlanDraft = this.createEmptyPowerPlanDraft();
    this.showBasicPowerDialog = true;
  }

  openEditBasicPowerDialog(index: number): void {
    this.editingBasicPowerIndex = index;
    this.isBasicPowerDialogClosing = false;
    this.powerPlanDraft = { ...this.basicPowerPlans[index] };
    this.showBasicPowerDialog = true;
  }

  closeBasicPowerDialog(): void {
    if (!this.showBasicPowerDialog || this.isBasicPowerDialogClosing) {
      return;
    }

    this.isBasicPowerDialogClosing = true;
    window.setTimeout(() => {
      this.showBasicPowerDialog = false;
      this.isBasicPowerDialogClosing = false;
      this.editingBasicPowerIndex = null;
    }, this.modalCloseDelay);
  }

  saveBasicPowerDialog(): void {
    const nextPlan = this.normalizePowerPlanDraft(false);
    if (!nextPlan) {
      return;
    }

    if (this.editingBasicPowerIndex === null) {
      this.basicPowerPlans = [...this.basicPowerPlans, nextPlan];
    } else {
      this.basicPowerPlans = this.basicPowerPlans.map((plan, index) =>
        index === this.editingBasicPowerIndex ? nextPlan : plan
      );
    }

    this.closeBasicPowerDialog();
  }

  async removeBasicPower(index: number): Promise<void> {
    const plan = this.basicPowerPlans[index];
    if (!await this.alert.confirm(
      '刪除基本用電確認',
      `確定要刪除「${plan.voltage}」基本用電嗎？`,
      '確定刪除',
    )) {
      return;
    }

    this.basicPowerPlans = this.basicPowerPlans.filter((_, planIndex) => planIndex !== index);
  }

  openAddExtraPowerDialog(): void {
    this.editingExtraPowerIndex = null;
    this.isExtraPowerDialogClosing = false;
    this.powerPlanDraft = this.createEmptyPowerPlanDraft();
    this.showExtraPowerDialog = true;
  }

  openEditExtraPowerDialog(index: number): void {
    this.editingExtraPowerIndex = index;
    this.isExtraPowerDialogClosing = false;
    this.powerPlanDraft = { ...this.extraPowerPlans[index] };
    this.showExtraPowerDialog = true;
  }

  closeExtraPowerDialog(): void {
    if (!this.showExtraPowerDialog || this.isExtraPowerDialogClosing) {
      return;
    }

    this.isExtraPowerDialogClosing = true;
    window.setTimeout(() => {
      this.showExtraPowerDialog = false;
      this.isExtraPowerDialogClosing = false;
      this.editingExtraPowerIndex = null;
    }, this.modalCloseDelay);
  }

  saveExtraPowerDialog(): void {
    const nextPlan = this.normalizePowerPlanDraft(true);
    if (!nextPlan) {
      return;
    }

    if (this.editingExtraPowerIndex === null) {
      this.extraPowerPlans = [...this.extraPowerPlans, nextPlan];
    } else {
      this.extraPowerPlans = this.extraPowerPlans.map((plan, index) =>
        index === this.editingExtraPowerIndex ? nextPlan : plan
      );
    }

    this.closeExtraPowerDialog();
  }

  async removeExtraPower(index: number): Promise<void> {
    const plan = this.extraPowerPlans[index];
    if (!await this.alert.confirm(
      '刪除用電方案確認',
      `確定要刪除「${plan.voltage} / ${plan.wattage ?? 0}W」用電方案嗎？`,
      '確定刪除',
    )) {
      return;
    }

    this.extraPowerPlans = this.extraPowerPlans.filter((_, planIndex) => planIndex !== index);
  }

  onLayoutSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    this.processLayoutFile(file, input);
  }

  /** 攤位配置圖拖曳進入上傳框時，顯示拖曳狀態。 */
  onLayoutDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isLayoutDragging = true;
  }

  /** 攤位配置圖拖曳離開上傳框時，取消拖曳狀態。 */
  onLayoutDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isLayoutDragging = false;
  }

  /** 攤位配置圖拖放上傳。 */
  onLayoutDrop(event: DragEvent, input: HTMLInputElement): void {
    event.preventDefault();
    this.isLayoutDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processLayoutFile(file, input);
    }
  }

  /** 移除已選擇的攤位配置圖。 */
  removeLayout(input: HTMLInputElement): void {
    this.releaseLayoutPreview();
    this.venueForm.layoutFileName = '';
    this.layoutUploadError = '';
    input.value = '';
  }

  openLayoutExampleDialog(): void {
    this.isLayoutExampleClosing = false;
    this.showLayoutExample = true;
  }

  closeLayoutExampleDialog(): void {
    if (!this.showLayoutExample || this.isLayoutExampleClosing) {
      return;
    }

    this.isLayoutExampleClosing = true;
    window.setTimeout(() => {
      this.showLayoutExample = false;
      this.isLayoutExampleClosing = false;
    }, this.modalCloseDelay);
  }

  /** 切換活動類型勾選狀態。 */
  toggleCategory(category: string): void {
    this.form.categories = this.isCategorySelected(category)
      ? this.form.categories.filter((item) => item !== category)
      : [...this.form.categories, category];
  }

  /** 判斷活動類型是否已被選取。 */
  isCategorySelected(category: string): boolean {
    return this.form.categories.includes(category);
  }

  /** 活動封面點擊選檔上傳。 */
  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }
    this.processCoverFile(file, input);
  }

  /** 活動封面拖曳進入上傳框時，顯示拖曳狀態。 */
  onCoverDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isCoverDragging = true;
  }

  /** 活動封面拖曳離開上傳框時，取消拖曳狀態。 */
  onCoverDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isCoverDragging = false;
  }

  /** 活動封面拖放上傳。 */
  onCoverDrop(event: DragEvent, input: HTMLInputElement): void {
    event.preventDefault();
    this.isCoverDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.processCoverFile(file, input);
    }
  }

  /** 移除已選擇的活動封面。 */
  removeCover(input: HTMLInputElement): void {
    this.releaseCoverPreview();
    this.form.coverFileName = '';
    this.coverUploadError = '';
    input.value = '';
  }

  /** 元件銷毀時釋放本機預覽圖 URL。 */
  ngOnDestroy(): void {
    this.releaseCoverPreview();
    this.releaseLayoutPreview();
  }

  /** 釋放活動封面預覽 URL，避免記憶體殘留。 */
  private releaseCoverPreview(): void {
    if (this.form.coverPreviewUrl) {
      if (this.form.coverPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.form.coverPreviewUrl);
      }
      this.form.coverPreviewUrl = '';
    }
  }

  /** 釋放攤位配置圖預覽 URL，避免記憶體殘留。 */
  private releaseLayoutPreview(): void {
    if (this.venueForm.layoutPreviewUrl) {
      if (this.venueForm.layoutPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(this.venueForm.layoutPreviewUrl);
      }
      this.venueForm.layoutPreviewUrl = '';
    }
  }

  /** 檢查活動封面檔案格式與大小，通過後建立預覽 URL。 */
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

  /** 檢查攤位配置圖檔案格式與大小，通過後建立預覽 URL。 */
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

  /** 編輯模式下，將既有活動資料帶入三步驟表單。 */
  private loadActivityIntoEditor(): void {
    if (this.activity.id === 15) {
      this.loadDraftTestActivityIntoEditor();
      return;
    }

    this.detailCategories = ['餐飲美食', '文創手作', '親子家庭', '植物選物'];

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
      totalBooths: 150,
      boothPrice: 2500,
      layoutFileName: 'booth-layout-example.svg',
      layoutPreviewUrl: 'assets/images/organizer/booth/booth-layout-example.svg',
    };

    this.boothZones = [
      { name: 'A 區', color: '#f97316', count: 50 },
      { name: 'B 區', color: '#65a30d', count: 50 },
      { name: 'C 區', color: '#0ea5e9', count: 50 },
    ];

    this.equipmentItems = this.createDefaultEquipmentItems();
    this.basicPowerPlans = this.createDefaultBasicPowerPlans();
    this.extraPowerPlans = this.createDefaultExtraPowerPlans();
    this.providesEquipmentRental = true;
    this.providesBasicPower = true;
    this.allowsExtraPower = true;
  }

  /** 草稿測試資料沒有實際圖片與內容，詳情頁需和列表保持同一筆草稿狀態。 */
  private loadDraftTestActivityIntoEditor(): void {
    this.detailCategories = [];

    this.form = {
      name: this.activity.name,
      coverFileName: '',
      coverPreviewUrl: '',
      categories: [],
      description: '',
      introduction: '',
    };

    this.timeForm = {
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

    this.venueForm = {
      city: '',
      district: '',
      address: '',
      venueName: '',
      boothWidth: null,
      boothLength: null,
      totalBooths: null,
      boothPrice: null,
      layoutFileName: '',
      layoutPreviewUrl: '',
    };

    this.boothZones = [];
    this.equipmentItems = [];
    this.basicPowerPlans = [];
    this.extraPowerPlans = [];
    this.providesEquipmentRental = true;
    this.providesBasicPower = true;
    this.allowsExtraPower = true;
  }

  /** 目前表單是否和初始快照不同。 */
  private get hasUnsavedChanges(): boolean {
    return this.getEditorSnapshot() !== this.initialEditorSnapshot;
  }

  /** 建立表單快照，用於未儲存變更比對。 */
  private getEditorSnapshot(): string {
    return JSON.stringify({
      form: this.form,
      timeForm: this.timeForm,
      venueForm: this.venueForm,
      boothZones: this.boothZones,
      equipmentItems: this.equipmentItems,
      providesEquipmentRental: this.providesEquipmentRental,
      providesBasicPower: this.providesBasicPower,
      basicPowerPlans: this.basicPowerPlans,
      allowsExtraPower: this.allowsExtraPower,
      extraPowerPlans: this.extraPowerPlans,
    });
  }

  private createEmptyEquipmentDraft(): EventEquipmentDraft {
    return {
      name: '',
      specification: '',
      unit: '',
      freeQuantity: 0,
      rentable: true,
      rentalPrice: null,
      rentalLimit: null,
      dailyRentalQuantity: null,
    };
  }

  private createEmptyPowerPlanDraft(): EventPowerPlanDraft {
    return {
      voltage: '',
      wattage: null,
      fee: null,
      description: '',
    };
  }

  private createDefaultEquipmentItems(): EventEquipment[] {
    return [
      {
        name: '帳篷',
        specification: '3 x 3 公尺',
        unit: '頂',
        freeQuantity: 1,
        rentable: false,
        rentalPrice: null,
        rentalLimit: null,
        dailyRentalQuantity: null,
      },
      {
        name: '桌子',
        specification: '180 x 60 x 75 cm',
        unit: '張',
        freeQuantity: 1,
        rentable: true,
        rentalPrice: 100,
        rentalLimit: 2,
        dailyRentalQuantity: 30,
      },
      {
        name: '椅子',
        specification: '一般塑膠椅',
        unit: '張',
        freeQuantity: 2,
        rentable: true,
        rentalPrice: 50,
        rentalLimit: 4,
        dailyRentalQuantity: 80,
      },
    ];
  }

  private createDefaultBasicPowerPlans(): EventPowerPlan[] {
    return [
      { voltage: '110V', wattage: 500, fee: null, description: '一般文創攤位適用' },
      { voltage: '220V', wattage: 2000, fee: null, description: '高功率設備適用' },
    ];
  }

  private createDefaultExtraPowerPlans(): EventPowerPlan[] {
    return [
      { voltage: '110V', wattage: 1000, fee: 200, description: '小型設備' },
      { voltage: '220V', wattage: 3000, fee: 500, description: '高功率設備' },
    ];
  }

  private normalizeEquipmentDraft(): EventEquipment | null {
    const freeQuantity = Number(this.equipmentDraft.freeQuantity);
    const rentalPrice = this.equipmentDraft.rentable ? Number(this.equipmentDraft.rentalPrice) : null;
    const rentalLimit = this.equipmentDraft.rentable ? Number(this.equipmentDraft.rentalLimit) : null;
    const dailyRentalQuantity = this.equipmentDraft.rentable ? Number(this.equipmentDraft.dailyRentalQuantity) : null;

    if (
      !this.equipmentDraft.name.trim() ||
      !this.equipmentDraft.specification.trim() ||
      !this.equipmentDraft.unit.trim() ||
      !Number.isInteger(freeQuantity) ||
      freeQuantity < 0 ||
      (this.equipmentDraft.rentable && (
        this.equipmentDraft.rentalPrice === null ||
        this.equipmentDraft.rentalLimit === null ||
        this.equipmentDraft.dailyRentalQuantity === null ||
        !this.isNonNegativeNumber(rentalPrice) ||
        !this.isPositiveInteger(rentalLimit) ||
        !this.isPositiveInteger(dailyRentalQuantity)
      ))
    ) {
      return null;
    }

    return {
      name: this.equipmentDraft.name.trim(),
      specification: this.equipmentDraft.specification.trim(),
      unit: this.equipmentDraft.unit.trim(),
      freeQuantity,
      rentable: this.equipmentDraft.rentable,
      rentalPrice,
      rentalLimit,
      dailyRentalQuantity,
    };
  }

  private normalizePowerPlanDraft(requireFee: boolean): EventPowerPlan | null {
    const wattage = Number(this.powerPlanDraft.wattage);
    const fee = requireFee ? Number(this.powerPlanDraft.fee) : null;

    if (
      !this.powerPlanDraft.voltage.trim() ||
      this.powerPlanDraft.wattage === null ||
      !Number.isFinite(wattage) ||
      wattage <= 0 ||
      (requireFee && this.powerPlanDraft.fee === null) ||
      (requireFee && !this.isNonNegativeNumber(fee))
    ) {
      return null;
    }

    return {
      voltage: this.powerPlanDraft.voltage.trim(),
      wattage,
      fee,
      description: this.powerPlanDraft.description.trim(),
    };
  }

  /** 驗證數字是否為大於 0 的有限數值。 */
  private isPositiveNumber(value: number | null): boolean {
    return value !== null && Number.isFinite(Number(value)) && Number(value) > 0;
  }

  /** 驗證數字是否為大於 0 的整數。 */
  private isPositiveInteger(value: number | null): boolean {
    return value !== null && Number.isInteger(Number(value)) && Number(value) > 0;
  }

  /** 驗證數字是否為大於等於 0 的有限數值。 */
  private isNonNegativeNumber(value: number | null): boolean {
    return value !== null && Number.isFinite(Number(value)) && Number(value) >= 0;
  }

  /** 檢查結束日期時間是否晚於開始日期時間。 */
  private isDateTimeRangeInvalid(startDate: string, startTime: string, endDate: string, endTime: string): boolean {
    if (!startDate || !startTime || !endDate || !endTime) {
      return false;
    }
    return this.toDateTime(endDate, endTime) <= this.toDateTime(startDate, startTime);
  }

  /** 檢查指定日期時間是否晚於比較日期時間。 */
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

  /** 檢查指定日期時間是否早於比較日期時間。 */
  private isDateTimeBefore(date: string, time: string, comparisonDate: string, comparisonTime: string): boolean {
    if (!date || !time || !comparisonDate || !comparisonTime) {
      return false;
    }
    return this.toDateTime(date, time) < this.toDateTime(comparisonDate, comparisonTime);
  }

  /** 將日期與時間字串轉成 timestamp，方便做前後順序比較。 */
  private toDateTime(date: string, time: string): number {
    return new Date(`${date}T${time}:00`).getTime();
  }
}
