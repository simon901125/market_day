import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { BoothLayoutExampleModal } from '../modals/booth-layout-example-modal/booth-layout-example-modal';
import { BoothZoneModal } from '../modals/booth-zone-modal/booth-zone-modal';
import { EquipmentModal } from '../modals/equipment-modal/equipment-modal';
import { BasicPowerModal } from '../modals/basic-power-modal/basic-power-modal';
import { ExtraPowerModal } from '../modals/extra-power-modal/extra-power-modal';
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
  OrganizerEventSaveEquipmentItem,
  OrganizerEventSaveRequest,
  OrganizerEventPublishResponse,
  OrganizerEventSubmitReviewResponse,
  StatusAction,
  VenueBoothForm,
} from '../../../../models/interface/organizer/OrganizerEventEditor';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { AddressApiService } from '../../../../core/services/address-api.service';
import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerEventDetail } from '../../../../models/interface/organizer/OrganizerEventDetail';
import { AlertService } from '../../../../core/services/alert.service';
import { ApiResult, isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';

function createEmptyEventTimeForm(): EventTimeForm {
  return {
    eventStartDate: '',
    eventEndDate: '',
    eventStartTime: '',
    eventEndTime: '',
    registrationStartDate: '',
    registrationStartTime: '',
    registrationEndDate: '',
    registrationEndTime: '',
    metro: '',
    bus: '',
    driving: '',
  };
}

@Component({
  selector: 'app-organizer-dashboard-event-detail',
  imports: [
    FormsModule,
    RouterLink,
    Dropdown,
    BoothZoneModal,
    BoothLayoutExampleModal,
    EquipmentModal,
    BasicPowerModal,
    ExtraPowerModal,
  ],
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
  isDetailLoading = false;
  detailLoadError = '';
  isStatusActionLoading = false;
  isRevisionRequired = false;
  reviewNote = '';
  private serverAvailableActions: string[] = [];

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

  /** 縣市與行政區 API 載入序號，避免較舊的請求覆蓋新選擇。 */
  private addressLoadId = 0;
  private districtLoadId = 0;

  /** Modal 退場動畫時間，需和帳號設定 modal 一致。 */
  private readonly modalCloseDelay = 180;

  /** 活動封面上傳錯誤訊息。 */
  coverUploadError = '';

  /** 攤位配置圖上傳錯誤訊息。 */
  layoutUploadError = '';

  /** 尚未送到圖片 API 的新封面與配置圖。 */
  private selectedCoverFile: File | null = null;
  private selectedLayoutFile: File | null = null;

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
  providesEquipmentRental: boolean | null = null;

  /** 是否提供基本免費用電。 */
  providesBasicPower: boolean | null = null;

  /** 是否開放額外申請用電。 */
  allowsExtraPower: boolean | null = null;

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

  /** 分類選項尚未有專用 API，先依資料庫固定種子資料對應 ID。 */
  private readonly categoryIdByName = new Map(this.categoryOptions.map((name, index) => [name, index + 1]));

  /** 由地址 API 取得的台灣縣市與行政區選項。 */
  cityOptions: string[] = [];
  districtOptions: string[] = [];

  /** 攤位分區預設色票。 */
  readonly zoneColors = ['#f97316', '#65a30d', '#0ea5e9', '#8b5cf6', '#ec4899'];

  /** 查看／編輯詳情時帶入的活動類型。 */
  detailCategories = ['餐飲美食', '文創手作', '親子家庭', '植物選物'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly addressApiService: AddressApiService,
    private readonly organizerApiService: OrganizerApiService,
    private readonly alert: AlertService,
  ) {
    this.activityId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editActivityId = Number(this.route.snapshot.queryParamMap.get('edit')) || 0;
    this.returnPage = Number(this.route.snapshot.queryParamMap.get('returnPage') || history.state?.returnPage) || 1;
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') || history.state?.returnStatus || '';
    const requestedStep = Number(this.route.snapshot.queryParamMap.get('step'));
    if (Number.isInteger(requestedStep) && requestedStep >= 1 && requestedStep <= this.steps.length) {
      this.currentStep = requestedStep - 1;
    }
    if (this.route.snapshot.queryParamMap.get('validation') === 'review') {
      this.submitAttempted = true;
      this.validationMessage = '活動資料尚未填寫完整';
    }
    this.isViewMode = this.activityId > 0;
    this.isEditMode = !this.isViewMode && this.editActivityId > 0;
    const stateActivity = history.state?.activity as OrganizerEventRow | undefined;
    this.activity = stateActivity ?? this.getFallbackActivity(this.activityId);

    if (this.isViewMode || this.isEditMode) void this.loadOrganizerEventDetail();

    if (!this.isViewMode) {
      void this.loadCityOptions();
    }
    this.initialEditorSnapshot = this.getEditorSnapshot();
  }

  private getFallbackActivity(activityId: number): OrganizerEventRow {
    return {
      id: activityId || 1,
      name: '',
      nameImage: 'assets/images/shared/no-image-placeholder.svg',
      date: '-',
      location: '',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    };
  }

  get statusClass(): string {
    return ActivityStatus.getClass(this.activity.status);
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

  get eventStartNotFuture(): boolean {
    return this.isDateTimeNotFuture(
      this.timeForm.eventStartDate,
      this.timeForm.eventStartTime,
    );
  }

  get registrationStartNotFuture(): boolean {
    return this.isDateTimeNotFuture(
      this.timeForm.registrationStartDate,
      this.timeForm.registrationStartTime,
    );
  }

  get boothZoneTotal(): number {
    return this.boothZones.reduce((total, zone) => total + Number(zone.count || 0), 0);
  }

  get boothZoneCountMismatch(): boolean {
    return this.isPositiveInteger(this.venueForm.totalBooths) &&
      this.boothZoneTotal !== Number(this.venueForm.totalBooths);
  }

  get boothZoneNamesInvalid(): boolean {
    if (this.boothZones.length > 26) return true;
    const names = this.boothZones.map((zone) => zone.name.trim().toUpperCase());
    return names.some((name) => !/^[A-Z] 區$/.test(name)) || new Set(names).size !== names.length;
  }

  get eventNameInvalid(): boolean {
    const value = this.form.name.trim();
    return !value || value.length > 50;
  }

  get eventDescriptionInvalid(): boolean {
    const value = this.form.description.trim();
    return !value || value.length > 300;
  }

  get eventIntroductionInvalid(): boolean {
    const value = this.form.introduction.trim();
    return !value || value.length > 800;
  }

  get categorySelectionInvalid(): boolean {
    return this.form.categories.length === 0 ||
      this.form.categories.some((category) => !this.categoryIdByName.has(category));
  }

  get citySelectionInvalid(): boolean {
    return !this.venueForm.city ||
      (this.cityOptions.length > 0 && !this.cityOptions.includes(this.venueForm.city));
  }

  get districtSelectionInvalid(): boolean {
    return !this.venueForm.district ||
      (this.districtOptions.length > 0 && !this.districtOptions.includes(this.venueForm.district));
  }

  get venueAddressInvalid(): boolean {
    const value = this.venueForm.address.trim();
    return !value || value.length > 255;
  }

  get venueNameInvalid(): boolean {
    const value = this.venueForm.venueName.trim();
    return !value || value.length > 200;
  }

  get isEquipmentPowerComplete(): boolean {
    const selectionsComplete =
      this.providesEquipmentRental !== null &&
      this.providesBasicPower !== null &&
      this.allowsExtraPower !== null;
    const equipmentReady = !this.providesEquipmentRental || this.equipmentItems.length > 0;
    const basicPowerReady = !this.providesBasicPower || this.basicPowerPlans.length > 0;
    const extraPowerReady = !this.allowsExtraPower || this.extraPowerPlans.length > 0;
    return selectionsComplete && equipmentReady && basicPowerReady && extraPowerReady;
  }

  get availableActions(): StatusAction[] {
    const definitions: Record<string, StatusAction> = {
      EDIT: { key: 'edit', label: '編輯', variant: 'outline' },
      SUBMIT_REVIEW: { key: 'submit', label: '送出審核', variant: 'primary' },
      DELETE: { key: 'delete', label: '刪除', variant: 'danger' },
      WITHDRAW_REVIEW: { key: 'withdraw', label: '撤回申請', variant: 'outline' },
      RESUBMIT_REVIEW: { key: 'resubmit', label: '重新送審', variant: 'primary' },
      PUBLISH: { key: 'publish', label: '發布活動', variant: 'primary' },
      REQUEST_UNPUBLISH: { key: 'unpublish', label: '下架活動', variant: 'outline' },
    };
    return this.serverAvailableActions.map((action) => definitions[action]).filter(Boolean);
  }

  /** 依據狀態按鈕執行送審、發布、下架、刪除等操作。 */
  async handleStatusAction(action: StatusAction): Promise<void> {
    if (this.isStatusActionLoading) return;
    this.feedbackMessage = '';
    if ((action.key === 'submit' || action.key === 'resubmit') && !await this.ensureReviewSubmissionIsValid()) {
      return;
    }
    switch (action.key) {
      case 'edit':
        this.router.navigate(['/organizer/dash-board/activity/detail'], {
          queryParams: { edit: this.activity.id, returnPage: this.returnPage, returnStatus: this.returnStatus || null },
          state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
        });
        return;
      case 'delete':
        if (!await this.alert.confirm(
          '刪除活動',
          `確定要刪除「${this.activity.name}」嗎？<br>刪除後將不會出現在活動管理列表中，且無法繼續編輯或送審。`,
          '確定刪除',
        )) {
          return;
        }
        await this.deleteOrganizerEvent();
        return;
      case 'submit':
        if (!await this.alert.confirm(
          '送出審核確認',
          `確定要送出「${this.activity.name}」進行審核嗎？<br>送出後將無法編輯活動內容，需待審核結果。`,
          '確定送出',
        )) {
          return;
        }
        const submitted = await this.requestOrganizerEventReview(this.activity.id);
        if (!submitted) return;
        this.activity = { ...this.activity, status: ActivityStatus.pendingReview };
        this.serverAvailableActions = submitted.availableActions;
        await this.alert.success(
          '送出審核成功',
          '活動資料已送出審核，管理員將盡快為您審核。<br>審核結果將透過站內通知告知您。',
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
        const resubmitted = await this.requestOrganizerEventReview(this.activity.id);
        if (!resubmitted) return;
        this.activity = { ...this.activity, status: ActivityStatus.pendingReview };
        this.serverAvailableActions = resubmitted.availableActions;
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
        if (!await this.withdrawOrganizerEventReview()) return;
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
        if (!await this.publishOrganizerEvent()) return;
        await this.alert.success(
          '發布活動成功',
          `活動「${this.activity.name}」已成功發布。<br>活動現已對外公開，所有人皆可瀏覽與報名。`,
          '知道了',
        );
        return;
      case 'unpublish':
        const reason = await this.alert.requiredReason({
          title: '申請下架活動',
          description: `請填寫「${this.activity.name}」的下架原因，送出後將由管理員審核。`,
          fieldLabel: '下架原因',
          placeholder: '請說明申請下架活動的原因',
          maxLength: 500,
          confirmButtonText: '下一步',
        });
        if (!reason) return;

        const confirmed = await this.alert.confirmReason({
          title: '確認送出下架申請',
          description: '請確認活動與下架原因，送出後將進入管理員審核流程。',
          subjectLabel: '活動名稱',
          subject: this.activity.name,
          reasonLabel: '下架原因',
          reason,
          confirmButtonText: '確認送出',
        });
        if (!confirmed) return;

        if (!await this.requestOrganizerEventUnpublish(reason)) return;
        await this.alert.success(
          '下架申請已送出',
          `活動「${this.activity.name}」已進入下架審核流程。<br>審核完成前，活動狀態為「下架申請中」。`,
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
  timeForm: EventTimeForm = createEmptyEventTimeForm();

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
    depositAmount: null,
    layoutFileName: '',
    layoutPreviewUrl: '',
  };

  /** 攤位分區清單，新增與編輯 Modal 都會更新這份資料。 */
  boothZones: BoothZone[] = [];

  /** 第一步必填欄位是否都已完成。 */
  get isBasicInfoComplete(): boolean {
    return Boolean(
      !this.eventNameInvalid &&
      this.form.coverPreviewUrl &&
      !this.categorySelectionInvalid &&
      !this.eventDescriptionInvalid &&
      !this.eventIntroductionInvalid
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
    ];
    const hasTransportation = [this.timeForm.metro, this.timeForm.bus, this.timeForm.driving]
      .every((value) => value.trim());

    return requiredTimes.every(Boolean) && hasTransportation &&
      !this.eventStartNotFuture &&
      !this.registrationStartNotFuture &&
      !this.eventDateTimeOrderInvalid &&
      !this.registrationDateTimeOrderInvalid &&
      !this.registrationEndAfterEventStart;
  }

  /** 第三步必填欄位是否都已完成，並檢查分區總數是否吻合攤位總數。 */
  get isVenueInfoComplete(): boolean {
    return Boolean(
      !this.citySelectionInvalid &&
      !this.districtSelectionInvalid &&
      !this.venueAddressInvalid &&
      !this.venueNameInvalid &&
      this.isPositiveNumber(this.venueForm.boothLength) &&
      this.isPositiveNumber(this.venueForm.boothWidth) &&
      this.isPositiveInteger(this.venueForm.totalBooths) &&
      this.isNonNegativeNumber(this.venueForm.boothPrice) &&
      this.isNonNegativeNumber(this.venueForm.depositAmount) &&
      this.boothZones.length > 0 &&
      !this.boothZoneNamesInvalid &&
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
        this.eventNameInvalid,
        !this.form.coverPreviewUrl,
        this.categorySelectionInvalid,
        this.eventDescriptionInvalid,
        this.eventIntroductionInvalid,
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
      ];
      const missingTimes = requiredTimes.filter((value) => !value).length;
      const missingTransportation = [this.timeForm.metro, this.timeForm.bus, this.timeForm.driving]
        .filter((value) => !value.trim()).length;
      const dateLogicErrors = [
        this.eventStartNotFuture,
        this.registrationStartNotFuture,
        this.eventDateTimeOrderInvalid,
        this.registrationDateTimeOrderInvalid,
        this.registrationEndAfterEventStart,
      ].filter(Boolean).length;
      return missingTimes + missingTransportation + dateLogicErrors;
    }

    if (step === 2) {
      return [
        this.citySelectionInvalid,
        this.districtSelectionInvalid,
        this.venueAddressInvalid,
        this.venueNameInvalid,
        !this.isPositiveNumber(this.venueForm.boothLength),
        !this.isPositiveNumber(this.venueForm.boothWidth),
        !this.isPositiveInteger(this.venueForm.totalBooths),
        !this.isNonNegativeNumber(this.venueForm.boothPrice),
        !this.isNonNegativeNumber(this.venueForm.depositAmount),
        this.boothZones.length === 0,
        this.boothZoneNamesInvalid,
        this.boothZoneCountMismatch,
        !this.venueForm.layoutFileName,
      ].filter(Boolean).length;
    }

    return [
      this.providesEquipmentRental === null,
      this.providesBasicPower === null,
      this.allowsExtraPower === null,
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

  /** 前往下一步；建立過程可自由切換步驟，完整驗證留到送審時執行。 */
  goNext(): void {
    if (this.currentStep < this.steps.length - 1) this.currentStep += 1;
  }

  /** 開啟新增攤位分區 Modal，並清空暫存資料。 */
  openAddZoneDialog(): void {
    if (this.boothZones.length >= 26) return;
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
      name: zone.name,
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
      void this.loadDistrictOptions(city);
    }
  }

  /** 儲存草稿並回到詳情查看狀態。 */
  async saveDraft(): Promise<void> {
    this.submitAttempted = false;
    this.validationMessage = '';

    if (this.totalErrorCount > 0) {
      const saveIncompleteDraft = await this.alert.confirm(
        '尚有必填資料未完成',
        '目前內容仍可儲存為草稿，未完成的欄位需在送出審核前補齊。',
        '儲存草稿',
        '繼續編輯',
      );
      if (!saveIncompleteDraft) return;
    }

    try {
      const response = await firstValueFrom(
        this.organizerApiService.saveOrganizerEvent(this.buildOrganizerEventSaveRequest()),
      );
      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        await this.alert.error('儲存失敗', response.message || '活動資料儲存失敗，請稍後再試。');
        return;
      }

      const eventId = response.data.eventId;
      const uploadErrors: string[] = [];
      if (this.selectedCoverFile) {
        try {
          const coverResponse = await firstValueFrom(
            this.organizerApiService.uploadOrganizerEventImage(eventId, 'EVENT_COVER', this.selectedCoverFile),
          );
          if (!isApiSuccessStatus(coverResponse.statusCode)) uploadErrors.push('活動封面');
        } catch {
          uploadErrors.push('活動封面');
        }
      }
      if (this.selectedLayoutFile) {
        try {
          const layoutResponse = await firstValueFrom(
            this.organizerApiService.uploadOrganizerEventImage(eventId, 'EVENT_MAP', this.selectedLayoutFile),
          );
          if (!isApiSuccessStatus(layoutResponse.statusCode)) uploadErrors.push('攤位配置圖');
        } catch {
          uploadErrors.push('攤位配置圖');
        }
      }

      if (uploadErrors.length > 0) {
        await this.alert.error(
          '圖片上傳失敗',
          `活動資料已儲存，但${uploadErrors.join('、')}上傳失敗，原圖仍會保留，請重新編輯後再試。`,
        );
      } else {
        await this.alert.success(
          '儲存草稿成功',
          '尚未完成的必填欄位可以稍後補充；送出審核前，系統會再次檢查所有必填資料。',
          '知道了',
        );
      }

      this.navigationAllowed = true;
      this.router.navigate(['/organizer/dash-board/activity/detail', eventId], {
        queryParams: { returnPage: this.returnPage, returnStatus: this.returnStatus || null },
      });
    } catch (error: unknown) {
      await this.alert.error(
        '儲存失敗',
        this.getRequestErrorMessage(error, '活動資料儲存失敗，請稍後再試。'),
      );
    }
  }

  private getRequestErrorMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) return fallback;

    const backendMessage = error.error && typeof error.error === 'object'
      && typeof error.error.message === 'string'
      ? error.error.message.trim()
      : '';
    if (backendMessage) return backendMessage;
    if (error.status >= 500) return `伺服器處理失敗（${error.status}），請查看後端錯誤紀錄。`;
    if (error.status > 0) return `請求失敗（${error.status}），請稍後再試。`;
    return '無法連線至後端服務，請確認後端已啟動。';
  }

  get transportationMissing(): boolean {
    return [this.timeForm.metro, this.timeForm.bus, this.timeForm.driving]
      .some((value) => !value.trim());
  }

  isTransportationFieldMissing(value: string): boolean {
    return !value.trim();
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
    const firstInvalidStep = this.getFirstInvalidStep();

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

      const eventId = await this.persistEditorForReview();
      if (!eventId) return;
      const review = await this.requestOrganizerEventReview(eventId);
      if (!review) return;

      this.activity = {
        ...this.activity,
        id: eventId,
        name: eventName,
        nameImage: this.form.coverPreviewUrl || this.activity.nameImage,
        status: ActivityStatus.pendingReview,
      };
      this.serverAvailableActions = review.availableActions;
      this.initialEditorSnapshot = this.getEditorSnapshot();
      this.navigationAllowed = true;

      await this.alert.success(
        '送出審核成功',
        '活動資料已送出審核，管理員將盡快為您審核。<br>審核結果將透過站內通知告知您。',
        '知道了',
      );
      this.router.navigate(['/organizer/dash-board/activity/detail', eventId], {
        queryParams: { returnPage: this.returnPage, returnStatus: this.returnStatus || null },
        state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
      });
      return;
    }

    this.validationMessage = '活動資料尚未填寫完整';
    this.currentStep = firstInvalidStep;

    await this.alert.error(
      '無法送出審核',
      `活動資料尚有 ${this.totalErrorCount} 項需要確認，已為您前往第一個未完成的步驟。`,
    );

    setTimeout(() => {
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }

  private async persistEditorForReview(): Promise<number | null> {
    try {
      const saved = await firstValueFrom(
        this.organizerApiService.saveOrganizerEvent(this.buildOrganizerEventSaveRequest()),
      );
      if (!isApiSuccessStatus(saved.statusCode) || !saved.data) {
        await this.alert.error('無法送出審核', saved.message || '活動資料儲存失敗。');
        return null;
      }

      const eventId = saved.data.eventId;
      const uploads: Array<{ label: string; file: File; purpose: 'EVENT_COVER' | 'EVENT_MAP' }> = [];
      if (this.selectedCoverFile) {
        uploads.push({ label: '活動封面', file: this.selectedCoverFile, purpose: 'EVENT_COVER' });
      }
      if (this.selectedLayoutFile) {
        uploads.push({ label: '攤位配置圖', file: this.selectedLayoutFile, purpose: 'EVENT_MAP' });
      }
      for (const upload of uploads) {
        const result = await firstValueFrom(
          this.organizerApiService.uploadOrganizerEventImage(eventId, upload.purpose, upload.file),
        );
        if (!isApiSuccessStatus(result.statusCode)) {
          await this.alert.error('無法送出審核', `${upload.label}上傳失敗，請重新上傳後再試。`);
          return null;
        }
      }
      return eventId;
    } catch (error) {
      await this.alert.error('無法送出審核', this.getRequestErrorMessage(error, '活動資料儲存失敗。'));
      return null;
    }
  }

  private async requestOrganizerEventReview(
    eventId: number,
  ): Promise<OrganizerEventSubmitReviewResponse | null> {
    try {
      const response = await firstValueFrom(
        this.organizerApiService.submitOrganizerEventReview(eventId),
      );
      if (isApiSuccessStatus(response.statusCode) && response.data) return response.data;
      await this.handleReviewSubmissionFailure(response, eventId);
      return null;
    } catch (error) {
      await this.alert.error('無法送出審核', this.getRequestErrorMessage(error, '送出審核失敗。'));
      return null;
    }
  }

  private async withdrawOrganizerEventReview(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.organizerApiService.withdrawOrganizerEventReview(this.activity.id),
      );
      if (isApiSuccessStatus(response.statusCode) && response.data) {
        await this.loadOrganizerEventDetail();
        return true;
      }
      await this.alert.error(
        '無法撤回申請',
        response.statusCode === 409
          ? '活動狀態已變更，可能已由管理員完成審核，系統將重新載入最新資料。'
          : response.message || '撤回審核申請失敗。',
      );
      await this.loadOrganizerEventDetail();
      return false;
    } catch (error) {
      await this.alert.error(
        '無法撤回申請',
        this.getRequestErrorMessage(error, '撤回審核申請失敗，請稍後再試。'),
      );
      await this.loadOrganizerEventDetail();
      return false;
    }
  }

  private async deleteOrganizerEvent(): Promise<void> {
    this.isStatusActionLoading = true;
    try {
      const response = await firstValueFrom(
        this.organizerApiService.deleteOrganizerEvent(this.activity.id),
      );
      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        const message = response.messageDetails
          ? `${response.message}：${response.messageDetails}`
          : response.message || '刪除活動失敗。';
        await this.alert.error('無法刪除活動', message);
        if (response.statusCode === 409) await this.loadOrganizerEventDetail();
        return;
      }

      await this.alert.success(
        '活動已刪除',
        `活動「${response.data.eventTitle}」已刪除，將不再顯示於活動管理列表。`,
        '知道了',
      );
      this.navigationAllowed = true;
      await this.router.navigate(['/organizer/dash-board/activity'], {
        queryParams: { page: this.returnPage, status: this.returnStatus || null },
      });
    } catch (error) {
      await this.alert.error(
        '無法刪除活動',
        this.getRequestErrorMessage(error, '刪除活動失敗，請稍後再試。'),
      );
    } finally {
      this.isStatusActionLoading = false;
    }
  }

  private async publishOrganizerEvent(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.organizerApiService.publishOrganizerEvent(this.activity.id),
      );
      if (isApiSuccessStatus(response.statusCode) && response.data) {
        await this.loadOrganizerEventDetail();
        return true;
      }
      await this.alert.error(
        '無法發布活動',
        response.statusCode === 409
          ? '活動狀態已變更，系統將重新載入最新資料。'
          : this.publishFailureMessage(response.data, response.message),
      );
      await this.loadOrganizerEventDetail();
      return false;
    } catch (error) {
      await this.alert.error(
        '無法發布活動',
        this.getRequestErrorMessage(error, '發布活動失敗，請稍後再試。'),
      );
      await this.loadOrganizerEventDetail();
      return false;
    }
  }

  private async requestOrganizerEventUnpublish(reason: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.organizerApiService.requestOrganizerEventUnpublish(this.activity.id, reason),
      );
      if (isApiSuccessStatus(response.statusCode) && response.data) {
        await this.loadOrganizerEventDetail();
        return true;
      }
      await this.alert.error(
        '無法送出下架申請',
        response.statusCode === 409
          ? '活動狀態已變更，或已有待審核的下架申請，系統將重新載入最新資料。'
          : response.message || '下架申請送出失敗。',
      );
      await this.loadOrganizerEventDetail();
      return false;
    } catch (error) {
      await this.alert.error(
        '無法送出下架申請',
        this.getRequestErrorMessage(error, '下架申請送出失敗，請稍後再試。'),
      );
      await this.loadOrganizerEventDetail();
      return false;
    }
  }

  private publishFailureMessage(
    publishResult: OrganizerEventPublishResponse | null | undefined,
    fallback: string,
  ): string {
    const fields = publishResult?.missingFields;
    if (!fields?.length) return fallback || '活動尚未符合發布條件。';
    if (fields.includes('booth.stalls')) {
      const expected = publishResult?.expectedStallCount;
      const actual = publishResult?.actualStallCount;
      if (expected !== null && expected !== undefined && actual !== undefined) {
        return `攤位地圖尚未建置完成，目前已建立 ${actual} / ${expected} 個攤位。`;
      }
    }
    const labels: Record<string, string> = {
      coverImage: '活動封面圖片',
      categoryIds: '活動類型',
      'booth.mapImage': '攤位配置圖片',
      'booth.zones': '攤位分區',
      'booth.stalls': '互動式攤位數量',
      'schedule.startAt': '活動開始時間',
      'schedule.endAt': '活動結束時間',
      'schedule.registrationEndAt': '報名截止時間',
    };
    return `請確認：${fields.map((field) => labels[field] ?? field).join('、')}。`;
  }

  private async handleReviewSubmissionFailure(
    response: ApiResult<OrganizerEventSubmitReviewResponse>,
    eventId: number,
  ): Promise<void> {
    const missingFields = response.data?.missingFields ?? [];
    const targetStep = this.reviewStepForMissingFields(missingFields);
    await this.alert.error(
      '無法送出審核',
      missingFields.length > 0
        ? `${response.message}，請完成 ${missingFields.length} 項必要資料。`
        : response.message || '送出審核失敗。',
    );
    if (targetStep < 0) return;
    if (!this.isViewMode) {
      this.currentStep = targetStep;
      this.validationMessage = '活動資料尚未填寫完整';
      return;
    }
    this.router.navigate(['/organizer/dash-board/activity/detail'], {
      queryParams: {
        edit: eventId,
        step: targetStep + 1,
        validation: 'review',
        returnPage: this.returnPage,
        returnStatus: this.returnStatus || null,
      },
    });
  }

  private reviewStepForMissingFields(fields: string[]): number {
    if (fields.some((field) => /^(eventTitle|summary|description|categoryIds|coverImage)/.test(field))) return 0;
    if (fields.some((field) => field.startsWith('schedule.') || field.startsWith('location.traffic'))) return 1;
    if (fields.some((field) => field.startsWith('location.') || field.startsWith('booth.'))) return 2;
    if (fields.some((field) => field.startsWith('equipment.'))) return 3;
    return -1;
  }

  /** 詳情頁的送審／重新送審也套用與編輯頁相同的完整驗證。 */
  private async ensureReviewSubmissionIsValid(): Promise<boolean> {
    const firstInvalidStep = this.getFirstInvalidStep();
    if (firstInvalidStep === -1) {
      return true;
    }

    await this.alert.error(
      '無法送出審核',
      `活動資料尚有 ${this.totalErrorCount} 項需要確認，請先完成必填欄位與資料限制。`,
    );
    this.router.navigate(['/organizer/dash-board/activity/detail'], {
      queryParams: {
        edit: this.activity.id,
        step: firstInvalidStep + 1,
        validation: 'review',
        returnPage: this.returnPage,
        returnStatus: this.returnStatus || null,
      },
      state: { activity: this.activity, returnPage: this.returnPage, returnStatus: this.returnStatus },
    });
    return false;
  }

  private getFirstInvalidStep(): number {
    return this.steps.findIndex((_, index) => this.getStepErrorCount(index) > 0);
  }

  /** 儲存新增或編輯後的攤位分區。 */
  saveZoneDialog(): void {
    const normalizedName = this.zoneDraft.name.trim();
    const normalizedColor = this.zoneDraft.color.trim();

    const normalizedCount = Number(this.zoneDraft.count);
    const normalizedZoneName = normalizedName.toUpperCase();
    const hasDuplicateName = this.zoneNamesForValidation.some(
      (name) => name.trim().toUpperCase() === normalizedZoneName
    );
    const hasDuplicateColor = this.zoneColorsForValidation.some(
      (color) => color.trim().toUpperCase() === normalizedColor.toUpperCase()
    );
    if (
      !normalizedName ||
      !/^[A-Z] 區$/.test(normalizedName) ||
      !Number.isInteger(normalizedCount) ||
      normalizedCount < 1 ||
      !/^#[0-9A-Fa-f]{6}$/.test(normalizedColor) ||
      hasDuplicateName ||
      hasDuplicateColor
    ) {
      return;
    }

    const nextZone: BoothZone = {
      name: normalizedName,
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
    this.selectedLayoutFile = null;
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
    this.selectedCoverFile = null;
    input.value = '';
  }

  /** 元件銷毀時釋放本機預覽圖 URL。 */
  ngOnDestroy(): void {
    this.addressLoadId += 1;
    this.districtLoadId += 1;
    this.releaseCoverPreview();
    this.releaseLayoutPreview();
  }

  private async loadCityOptions(): Promise<void> {
    const addressLoadId = ++this.addressLoadId;

    try {
      const response = await firstValueFrom(
        this.addressApiService.getAddressCities(),
      );
      if (addressLoadId !== this.addressLoadId) {
        return;
      }

      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        await this.alert.error('載入失敗', response.message || '無法取得縣市資料，請稍後再試。');
        return;
      }

      this.cityOptions = response.data;
      if (this.venueForm.city) {
        await this.loadDistrictOptions(
          this.venueForm.city,
          this.venueForm.district,
          addressLoadId,
        );
      }
    } catch {
      if (addressLoadId === this.addressLoadId) {
        await this.alert.error('載入失敗', '無法取得縣市資料，請稍後再試。');
      }
    }
  }

  private async loadDistrictOptions(
    city: string,
    preferredDistrict = '',
    addressLoadId?: number,
  ): Promise<void> {
    const districtLoadId = ++this.districtLoadId;
    this.districtOptions = [];

    if (!city) {
      this.venueForm.district = '';
      return;
    }

    try {
      const response = await firstValueFrom(
        this.addressApiService.getAddressDistricts(city),
      );
      if (
        districtLoadId !== this.districtLoadId
        || (addressLoadId !== undefined && addressLoadId !== this.addressLoadId)
      ) {
        return;
      }

      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        await this.alert.error('載入失敗', response.message || '無法取得行政區資料，請稍後再試。');
        return;
      }

      this.districtOptions = response.data;
      this.venueForm.district = this.districtOptions.includes(preferredDistrict)
        ? preferredDistrict
        : '';
    } catch {
      if (districtLoadId === this.districtLoadId) {
        await this.alert.error('載入失敗', '無法取得行政區資料，請稍後再試。');
      }
    }
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
    this.selectedCoverFile = file;
  }

  /** 檢查攤位配置圖檔案格式與大小，通過後建立預覽 URL。 */
  private processLayoutFile(file: File, input: HTMLInputElement): void {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      this.layoutUploadError = '攤位配置圖僅支援 JPG、PNG 圖片';
      input.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.layoutUploadError = '攤位配置圖檔案不可超過 5 MB';
      input.value = '';
      return;
    }

    this.releaseLayoutPreview();
    this.layoutUploadError = '';
    this.venueForm.layoutFileName = file.name;
    this.venueForm.layoutPreviewUrl = URL.createObjectURL(file);
    this.selectedLayoutFile = file;
  }

  private async loadOrganizerEventDetail(): Promise<void> {
    const eventId = this.isViewMode ? this.activityId : this.editActivityId;
    this.isDetailLoading = true;
    this.detailLoadError = '';
    try {
      const response = await firstValueFrom(this.organizerApiService.getOrganizerEventDetail(eventId));
      if (!isApiSuccessStatus(response.statusCode) || !response.data) {
        this.detailLoadError = response.message || '無法取得活動詳情';
        return;
      }
      this.applyOrganizerEventDetail(response.data);
      this.initialEditorSnapshot = this.getEditorSnapshot();
    } catch {
      this.detailLoadError = '無法取得活動詳情，請稍後再試。';
    } finally {
      this.isDetailLoading = false;
    }
  }

  private applyOrganizerEventDetail(detail: OrganizerEventDetail): void {
    const start = this.splitDateTime(detail.schedule.startAt);
    const end = this.splitDateTime(detail.schedule.endAt);
    const registrationStart = this.splitDateTime(detail.schedule.registrationStartAt);
    const registrationEnd = this.splitDateTime(detail.schedule.registrationEndAt);
    const cover = detail.coverImageUrl || 'assets/images/shared/no-image-placeholder.svg';
    this.activity = {
      id: detail.eventId,
      name: detail.eventTitle ?? '',
      nameImage: cover,
      date: `${start.date || '-'} - ${end.date || '-'}`,
      location: [detail.location.city, detail.location.district, detail.location.locationName].filter(Boolean).join(' '),
      status: detail.statusText,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    };
    this.serverAvailableActions = detail.availableActions;
    this.isRevisionRequired = detail.workflowStatus === 'REVISION_REQUIRED';
    this.reviewNote = detail.reviewNote?.trim() || '請依照審核通知補齊活動資料。';
    detail.categories.forEach((category) => this.categoryIdByName.set(category.categoryName, category.categoryId));
    this.detailCategories = detail.categories.map((category) => category.categoryName);
    this.form = {
      name: detail.eventTitle ?? '',
      coverFileName: detail.coverImageUrl?.split('/').pop() ?? '',
      coverPreviewUrl: detail.coverImageUrl ?? '',
      categories: [...this.detailCategories],
      description: detail.summary ?? '',
      introduction: detail.description ?? '',
    };
    this.timeForm = {
      eventStartDate: start.date,
      eventEndDate: end.date,
      eventStartTime: start.time,
      eventEndTime: end.time,
      registrationStartDate: registrationStart.date,
      registrationStartTime: registrationStart.time,
      registrationEndDate: registrationEnd.date,
      registrationEndTime: registrationEnd.time,
      metro: detail.location.trafficInfoMetro ?? '',
      bus: detail.location.trafficInfoBus ?? '',
      driving: detail.location.trafficInfoDriving ?? '',
    };
    this.venueForm = {
      city: detail.location.city ?? '',
      district: detail.location.district ?? '',
      address: detail.location.address ?? '',
      venueName: detail.location.locationName ?? '',
      boothWidth: detail.booth.stallWidth,
      boothLength: detail.booth.stallLength,
      totalBooths: detail.booth.maxBooths,
      boothPrice: detail.booth.baseFee,
      depositAmount: detail.booth.depositAmount,
      layoutFileName: detail.booth.mapImageUrl?.split('/').pop() ?? '',
      layoutPreviewUrl: detail.booth.mapImageUrl ?? '',
    };
    this.boothZones = detail.booth.zones.map((zone, index) => ({
      name: zone.zoneName,
      color: zone.colorCode ?? this.zoneColors[index % this.zoneColors.length],
      count: zone.stallCount,
    }));
    this.mapEquipmentItems(detail);
  }

  private mapEquipmentItems(detail: OrganizerEventDetail): void {
    const equipment = detail.equipment.items.filter((item) => item.itemType === 'EQUIPMENT');
    const equipmentGroups = new Map<string, typeof equipment>();
    equipment.forEach((item) => {
      const key = item.equipmentGroupKey || item.name;
      equipmentGroups.set(key, [...(equipmentGroups.get(key) ?? []), item]);
    });
    this.equipmentItems = [...equipmentGroups.values()].map((group) => {
      const free = group.find((item) => item.chargeType === 'FREE');
      const paid = group.find((item) => item.chargeType === 'PAID');
      const source = free ?? paid!;
      return {
        name: source.name,
        specification: source.description ?? '',
        unit: source.unit ?? '',
        freeQuantity: free?.perStallRentalLimit ?? 0,
        rentable: Boolean(paid),
        rentalPrice: paid?.rentalFee ?? null,
        rentalLimit: paid?.perStallRentalLimit ?? null,
        dailyRentalQuantity: paid?.stockQuantity ?? null,
      };
    });
    const power = detail.equipment.items.filter((item) => item.itemType === 'POWER');
    const toPowerPlan = (item: typeof power[number]): EventPowerPlan => ({
      voltage: item.name,
      wattage: item.wattageLimit,
      fee: item.chargeType === 'PAID' ? item.rentalFee : null,
      description: item.description ?? '',
    });
    this.basicPowerPlans = power.filter((item) => item.chargeType === 'FREE').map(toPowerPlan);
    this.extraPowerPlans = power.filter((item) => item.chargeType === 'PAID').map(toPowerPlan);
    this.providesEquipmentRental = detail.equipment.providesEquipmentRental;
    this.providesBasicPower = detail.equipment.providesBasicPower;
    this.allowsExtraPower = detail.equipment.allowsExtraPower;
  }

  private splitDateTime(value: string | null): { date: string; time: string } {
    if (!value) return { date: '', time: '' };
    const [date, time = ''] = value.split('T');
    return { date, time: time.slice(0, 5) };
  }

  private buildOrganizerEventSaveRequest(): OrganizerEventSaveRequest {
    const categoryIds = this.form.categories
      .map((category) => this.categoryIdByName.get(category))
      .filter((id): id is number => id !== undefined);
    return {
      eventId: this.isEditMode ? this.editActivityId : null,
      eventTitle: this.form.name.trim() || null,
      summary: this.form.description.trim() || null,
      description: this.form.introduction.trim() || null,
      categoryIds,
      schedule: {
        startAt: this.toApiDateTimeOrNull(this.timeForm.eventStartDate, this.timeForm.eventStartTime),
        endAt: this.toApiDateTimeOrNull(this.timeForm.eventEndDate, this.timeForm.eventEndTime),
        registrationStartAt: this.toApiDateTimeOrNull(this.timeForm.registrationStartDate, this.timeForm.registrationStartTime),
        registrationEndAt: this.toApiDateTimeOrNull(this.timeForm.registrationEndDate, this.timeForm.registrationEndTime),
      },
      location: {
        locationName: this.venueForm.venueName.trim() || null,
        city: this.venueForm.city || null,
        district: this.venueForm.district || null,
        address: this.venueForm.address.trim() || null,
        trafficInfoMetro: this.timeForm.metro.trim() || null,
        trafficInfoBus: this.timeForm.bus.trim() || null,
        trafficInfoDriving: this.timeForm.driving.trim() || null,
      },
      booth: {
        maxBooths: this.isPositiveInteger(this.venueForm.totalBooths)
          ? Number(this.venueForm.totalBooths)
          : null,
        stallWidth: this.venueForm.boothWidth,
        stallLength: this.venueForm.boothLength,
        baseFee: this.venueForm.boothPrice,
        depositAmount: this.venueForm.depositAmount,
        zones: this.boothZones.map((zone) => ({
          zoneId: null,
          zoneName: zone.name.trim(),
          stallCount: Number(zone.count),
          colorCode: zone.color.toUpperCase(),
        })),
      },
      equipment: {
        providesEquipmentRental: this.providesEquipmentRental,
        providesBasicPower: this.providesBasicPower,
        allowsExtraPower: this.allowsExtraPower,
        items: this.buildOrganizerEventEquipmentItems(),
      },
    };
  }

  /** 草稿允許日期與時間尚未成對填寫；完整值才轉為 API 日期時間。 */
  private toApiDateTimeOrNull(date: string, time: string): string | null {
    return date && time ? `${date}T${time}:00` : null;
  }

  private buildOrganizerEventEquipmentItems(): OrganizerEventSaveEquipmentItem[] {
    const items: OrganizerEventSaveEquipmentItem[] = [];
    if (this.providesEquipmentRental) {
      this.equipmentItems.forEach((equipment, index) => {
        const equipmentGroupKey = `equipment-${index + 1}`;
        if (equipment.freeQuantity > 0) {
          items.push(this.toEquipmentItem(equipment, equipmentGroupKey, 'FREE'));
        }
        if (equipment.rentable) {
          items.push(this.toEquipmentItem(equipment, equipmentGroupKey, 'PAID'));
        }
      });
    }
    if (this.providesBasicPower) {
      this.basicPowerPlans.forEach((plan) => items.push(this.toPowerEquipmentItem(plan, 'FREE')));
    }
    if (this.allowsExtraPower) {
      this.extraPowerPlans.forEach((plan) => items.push(this.toPowerEquipmentItem(plan, 'PAID')));
    }
    return items;
  }

  private toEquipmentItem(
    equipment: EventEquipment,
    equipmentGroupKey: string,
    chargeType: 'FREE' | 'PAID',
  ): OrganizerEventSaveEquipmentItem {
    return {
      equipmentId: null,
      equipmentGroupKey,
      name: equipment.name,
      rentalFee: chargeType === 'PAID' ? Number(equipment.rentalPrice) : 0,
      pricingUnit: 'DAY',
      unit: equipment.unit,
      chargeType,
      itemType: 'EQUIPMENT',
      description: equipment.specification || null,
      stockQuantity: chargeType === 'PAID' ? Number(equipment.dailyRentalQuantity) : null,
      perStallRentalLimit: chargeType === 'PAID'
        ? Number(equipment.rentalLimit) : equipment.freeQuantity,
      rentalStatus: 'ACTIVE',
      wattageLimit: null,
    };
  }

  private toPowerEquipmentItem(
    plan: EventPowerPlan,
    chargeType: 'FREE' | 'PAID',
  ): OrganizerEventSaveEquipmentItem {
    return {
      equipmentId: null,
      equipmentGroupKey: null,
      name: plan.voltage,
      rentalFee: chargeType === 'PAID' ? Number(plan.fee) : 0,
      pricingUnit: 'DAY',
      unit: null,
      chargeType,
      itemType: 'POWER',
      description: plan.description || null,
      stockQuantity: null,
      perStallRentalLimit: null,
      rentalStatus: 'ACTIVE',
      wattageLimit: Number(plan.wattage),
    };
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
      depositAmount: 0,
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
      depositAmount: null,
      layoutFileName: '',
      layoutPreviewUrl: '',
    };

    this.boothZones = [];
    this.equipmentItems = [];
    this.basicPowerPlans = [];
    this.extraPowerPlans = [];
    this.providesEquipmentRental = null;
    this.providesBasicPower = null;
    this.allowsExtraPower = null;
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

  /** 送審時，活動與報名開始時間都必須晚於現在。 */
  private isDateTimeNotFuture(date: string, time: string): boolean {
    if (!date || !time) {
      return false;
    }
    return this.toDateTime(date, time) <= Date.now();
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
