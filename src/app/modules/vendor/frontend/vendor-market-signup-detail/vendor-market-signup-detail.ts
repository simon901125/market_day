import { Component, OnInit } from '@angular/core';
import { formatServiceTime } from '../../../../core/utils/service-time.util';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertService } from '../../../../core/services/alert.service';
import { VendorAccessService } from '../../../../core/services/vendor-access.service';
import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { MarketSlot } from '../../../../models/interface/shared/MarketSlot';
import {
  VendorMarketDetail,
  VendorMarketEquipment,
} from '../../../../models/interface/vendor/VendorMarketDetail';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';

@Component({
  selector: 'app-vendor-market-signup-detail',
  imports: [VendorHeader, UserFooter, RouterLink],
  templateUrl: './vendor-market-signup-detail.html',
  styleUrl: './vendor-market-signup-detail.scss',
})
export class VendorMarketSignupDetail implements OnInit {
  /** 從列表頁帶入的市集資料，detail 與後續報名流程共用。 */
  market: MarketCardItem | null = null;
  detail: VendorMarketDetail | null = null;
  isLoading = false;
  loadError = '';

  /** 「每日剩餘名額」目前選取的 index。 */
  selectedSlotIndex = 0;

  /** 取得總攤位數 */
  get boothTotal(): number {
    return this.detail?.dailyAvailability[0]?.totalStalls ?? this.market?.maxBooths ?? 0;
  }
  /** 攤主報名流程 */
  readonly signupSteps = [
    {
      icon: 'bi-pencil',
      title: '填寫報名資料',
      description: '填寫品牌與攤位需求，並上傳相關申請文件。',
    },
    {
      icon: 'bi-file-earmark-text',
      title: '確認送出申請',
      description: '確認資料無誤後送出報名申請。',
    },
    {
      icon: 'bi-hourglass-split',
      title: '等待資格審核',
      description: '主辦方將依品牌與品項進行審核。',
    },
    {
      icon: 'bi-credit-card',
      title: '完成費用付款',
      description: '審核通過後，於期限內完成繳費。',
    },
    { icon: 'bi-geo-alt', title: '選擇攤位', description: '付款成功後，依通知選擇可用攤位。' },
    { icon: 'bi-check-circle', title: '完成報名', description: '完成選位後，即完成本次市集報名。' },
  ];

  readonly notices = [
    {
      icon: 'bi-patch-check',
      title: '報名資格',
      items: [
        '每位攤主同一活動僅能報名一次。',
        '完成資料填寫後，始可送出報名。',
        '品項須符合本活動招商類別。',
      ],
    },
    {
      icon: 'bi-diagram-3',
      title: '取消與退款',
      items: [
        '審核後、付款前可自行取消報名。',
        '完成付款後，請依退款規範辦理。',
        '名額截止前提出退費申請。',
      ],
    },
    {
      icon: 'bi-calendar2-event',
      title: '活動規範',
      items: [
        '設備數量有限，依完成報名順序保留。',
        '額外用電須事先申請。',
        '活動當日請依指定時間完成報到。',
      ],
    },
    {
      icon: 'bi-shield-check',
      title: '保證金退還',
      items: [
        '活動結束且設備確認無損後，於現場全額退還。',
        '現場清潔與垃圾請自行處理。',
        '違反活動規範者得酌收保證金。',
      ],
    },
  ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly vendorService: VendorService,
    private readonly alert: AlertService,
    private readonly vendorAccess: VendorAccessService,
  ) {
    const navigation = this.router.currentNavigation();
    this.market = navigation?.extras.state?.['market'] || history.state?.['market'] || null;

    const stateIndex =
      navigation?.extras.state?.['selectedSlotIndex'] ?? history.state?.['selectedSlotIndex'];
    if (typeof stateIndex === 'number') {
      this.selectedSlotIndex = stateIndex;
    }
  }

  ngOnInit(): void {
    void this.vendorAccess.initialize(true);
    const routeId = this.route.snapshot.paramMap.get('id');
    const eventId = routeId ?? this.market?.id;

    if (eventId) {
      this.loadMarketDetail(eventId);
    }
  }

  /**
   * 
   * @param eventId 
   */
  private loadMarketDetail(eventId: number | string): void {
    this.isLoading = true;
    this.loadError = '';

    this.vendorService.getMarketDetail(eventId).subscribe({
      next: (response) => {
        if (!response.data) {
          this.market = null;
          this.loadError = response.message || '找不到市集資料。';
        } else {
          this.detail = response.data;
          this.market = this.toMarketCard(response.data);
          this.selectedSlotIndex = Math.min(
            this.selectedSlotIndex,
            Math.max(this.market.slots!.length - 1, 0),
          );
        }
        this.isLoading = false;
      },
      error: () => {
        this.market = null;
        this.loadError = '市集詳細資料載入失敗，請稍後再試。';
        this.isLoading = false;
      },
    });
  }

  private toMarketCard(detail: VendorMarketDetail): MarketCardItem {
    const statusMap: Record<VendorMarketDetail['registrationStatus'], string> = {
      OPEN: MarketStatus.registrationOpen,
      FULL: MarketStatus.full,
    };
    const status = statusMap[detail.registrationStatus];
    const categoryNames = (detail.categories ?? [])
      .map((category) => category.name?.trim())
      .filter((name): name is string => Boolean(name));

    if (categoryNames.length === 0 && detail.categoryName?.trim()) {
      categoryNames.push(detail.categoryName.trim());
    }

    return {
      id: String(detail.eventId),
      title: detail.eventTitle,
      time: `${this.formatTime(detail.startAt)} - ${this.formatTime(detail.endAt)}`,
      start_date: this.formatApiDate(detail.startAt),
      end_date: this.formatApiDate(detail.endAt),
      description: detail.summary,
      location: detail.locationName,
      address: [detail.city, detail.district, detail.address].filter(Boolean).join(''),
      city: detail.city,
      area: detail.district,
      image: detail.coverImageUrl || 'assets/images/market/cards/market-card-01.png',
      status,
      statusClass: MarketStatus.getClass(status),
      tags: categoryNames,
      category: categoryNames.join('、'),
      organizer: detail.organizerName || detail.companyName || '',
      transportation: detail.trafficInfos.flatMap((item) =>
        [item.trafficTitle, item.trafficDetails].filter(Boolean),
      ),
      price: detail.baseFee,
      maxBooths: detail.maxBooths,
      registrationStartAt: detail.registrationStartAt ?? undefined,
      registrationEndAt: detail.registrationEndAt ?? undefined,
      slots: detail.dailyAvailability.map((slot) => ({
        date: this.formatMonthDay(slot.applyDate),
        remaining: slot.remainingStalls,
        total: slot.totalStalls,
        isFull: slot.remainingStalls <= 0,
      })),
    };
  }

  get dateRangeText(): string {
    if (!this.market) return '-';
    const activityTime = this.market.time?.trim();
    return `${this.market.start_date} - ${this.market.end_date}${activityTime ? ` ${activityTime}` : ''}`;
  }

  get signupDeadline(): string {
    if (!this.market) return '-';

    if (this.market.registrationEndAt) {
      return this.formatDateTime(this.market.registrationEndAt);
    }

    const start = new Date(this.market.start_date);
    if (Number.isNaN(start.getTime())) return this.market.end_date;

    start.setDate(start.getDate() - 10);
    return this.formatDate(start);
  }

  get signupRangeText(): string {
    if (!this.market) return '-';

    if (this.market.registrationStartAt && this.market.registrationEndAt) {
      return `${this.formatDateTime(this.market.registrationStartAt)} - ${this.formatDateTime(
        this.market.registrationEndAt,
      )}`;
    }

    const start = new Date(this.market.start_date);
    if (Number.isNaN(start.getTime())) return `即日起 - ${this.signupDeadline}`;

    const openDate = new Date(start);
    openDate.setDate(openDate.getDate() - 60);
    return `${this.formatDate(openDate)} 00:00 - ${this.signupDeadline} 23:59`;
  }

  get priceText(): string {
    return this.market?.price != null ? `$${this.market.price} / 天 / 攤` : '依主辦單位公告';
  }

  get marketDescription(): string {
    return this.detail?.description || this.market?.description || '';
  }

  get freeEquipments(): VendorMarketEquipment[] {
    return (
      this.detail?.equipments.filter(
        (item) => item.itemType === 'EQUIPMENT' && item.chargeType === 'FREE',
      ) ?? []
    );
  }

  get rentalEquipments(): VendorMarketEquipment[] {
    return (
      this.detail?.equipments.filter(
        (item) => item.itemType === 'EQUIPMENT' && item.chargeType === 'PAID',
      ) ?? []
    );
  }

  get freePowerOptions(): VendorMarketEquipment[] {
    return (
      this.detail?.equipments.filter(
        (item) => item.itemType === 'POWER' && item.chargeType === 'FREE',
      ) ?? []
    );
  }

  get paidPowerOptions(): VendorMarketEquipment[] {
    return (
      this.detail?.equipments.filter(
        (item) => item.itemType === 'POWER' && item.chargeType === 'PAID',
      ) ?? []
    );
  }

  get stallSizeText(): string {
    const { stallWidth, stallLength } = this.detail ?? {};
    return stallWidth && stallLength ? `${stallWidth} × ${stallLength} 公尺` : '依主辦單位公告';
  }

  get serviceTimeText(): string {
    if (!this.detail) return '-';
    return formatServiceTime(
      this.detail.serviceDays,
      this.detail.serviceStartTime,
      this.detail.serviceEndTime,
    );
  }

  equipmentDescription(item: VendorMarketEquipment): string {
    return [item.name, item.description].filter(Boolean).join('（') + (item.description ? '）' : '');
  }

  equipmentPrice(item: VendorMarketEquipment): string {
    const unitMap: Record<string, string> = {
      DAY: '天',
      EVENT: '場',
      UNIT: '份',
    };
    const rawUnit = item.pricingUnit || item.unit || '份';
    const unit = unitMap[rawUnit.toUpperCase()] ?? rawUnit;
    return `$${item.rentalFee} / ${unit}`;
  }

  powerDescription(item: VendorMarketEquipment): string {
    const wattage = item.wattageLimit ? `${item.wattageLimit}W` : '';
    return [item.name, wattage, item.description].filter(Boolean).join(' ｜ ');
  }

  get slots(): MarketSlot[] {
    if (this.market?.slots?.length) {
      return this.market.slots;
    }

    if (!this.market) return [];
    const start = this.parseDate(this.market.start_date);
    const end = this.parseDate(this.market.end_date);
    if (!start || !end || end < start) return [];

    const slots: MarketSlot[] = [];
    const cursor = new Date(start);
    while (cursor <= end) {
      slots.push({
        date: `${String(cursor.getMonth() + 1).padStart(2, '0')}/${String(cursor.getDate()).padStart(2, '0')}`,
        remaining: this.boothTotal,
        total: this.boothTotal,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return slots;
  }

  get selectedSlot(): MarketSlot | null {
    return this.slots[this.selectedSlotIndex] ?? null;
  }

  get selectedSlotDate(): string {
    return this.selectedSlot?.date || this.market?.start_date || '-';
  }

  get remainingBooths(): number {
    return this.slots.reduce((total, slot) => total + slot.remaining, 0);
  }

  slotDateLabel(date: string): string {
    const normalizedDate =
      date.includes('/') && date.split('/').length === 2 && this.market
        ? `${new Date(this.market.start_date).getFullYear()}/${date}`
        : date;
    const parsedDate = new Date(normalizedDate);
    if (Number.isNaN(parsedDate.getTime())) return date;

    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    return `${date}（${weekdays[parsedDate.getDay()]}）`;
  }

  get vendorProfileRequired(): boolean {
    return this.vendorAccess.needsProfile() === true;
  }

  /** 前往報名資料填寫頁；首次登入尚未建立攤位資料時先引導完成設定。 */
  async goToSignUpForm(): Promise<void> {
    const needsProfile = await this.vendorAccess.initialize();
    if (needsProfile) {
      const openStallProfile = await this.alert.confirm(
        '請先完成攤位資料',
        '完成「我的攤位」資料並儲存後，才能報名市集。',
        '立即設定',
        '稍後再說',
      );
      if (openStallProfile) {
        await this.router.navigate(['/vendor/dash-board/myStall']);
      }
      return;
    }

    await this.router.navigate(['/vendor/sign-up-form'], {
      state: {
        market: this.market,
        detail: this.detail,
        slots: this.slots,
        selectedSlotIndex: this.selectedSlotIndex,
      },
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  private formatApiDate(value: string): string {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : this.formatDate(date);
  }

  private formatMonthDay(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
  }

  private formatTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  private formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${this.formatDate(date)} ${hours}:${minutes}`;
  }

  private parseDate(value: string): Date | null {
    const parts = value.match(/\d+/g)?.map(Number) ?? [];
    if (parts.length < 3) return null;

    const [year, month, day] = parts;
    const parsed = new Date(year, month - 1, day);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
}
