import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  OrganizerRegistrationDetail,
  OrganizerRegistrationDetailAction,
  OrganizerRegistrationDetailSeed,
  OrganizerRegistrationStatusRecordItem,
} from '../../../../models/interface/organizer/OrganizerRegistrationDetail';
import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';

// 暫時對齊報名管理列表的靜態資料，之後串接 API 時可由詳情 endpoint 取代。
const registrationRows: OrganizerRegistrationDetailSeed[] = [
  {
    id: 1,
    activity: '夏日綠意市集',
    activityImage: 'assets/images/market/cards/market-card-01.png',
    activityTime: '2026/06/15 - 2026/06/21',
    brandName: '森森選物',
    vendorName: '林小森',
    brandType: '文創手作',
    registeredAt: '2026/06/01 14:30',
    status: ApplicationStatus.pendingReview,
  },
  {
    id: 2,
    activity: '職人咖啡生活市集',
    activityImage: 'assets/images/market/cards/market-card-02.png',
    activityTime: '2026/06/27 - 2026/06/28',
    brandName: '毛孩日常',
    vendorName: '陳小米',
    brandType: '寵物生活',
    registeredAt: '2026/06/01 10:15',
    status: ApplicationStatus.reviewRejected,
  },
  {
    id: 3,
    activity: '衣著選物週末',
    activityImage: 'assets/images/market/cards/market-card-03.png',
    activityTime: '2026/07/04 - 2026/07/05',
    brandName: '慢日子',
    vendorName: '黃慢慢',
    brandType: '文創手作',
    registeredAt: '2026/05/31 16:45',
    status: ApplicationStatus.pendingPayment,
  },
  {
    id: 4,
    activity: '風格選物生活節',
    activityImage: 'assets/images/market/cards/market-card-04.png',
    activityTime: '2026/07/18 - 2026/07/19',
    brandName: '植感生活',
    vendorName: '周植植',
    brandType: '植物選物',
    registeredAt: '2026/05/30 09:20',
    status: ApplicationStatus.pendingSelection,
  },
  {
    id: 5,
    activity: '毛孩友善市集',
    activityImage: 'assets/images/market/cards/market-card-05.png',
    activityTime: '2026/08/01 - 2026/08/02',
    brandName: '小日子手作',
    vendorName: '張小日',
    brandType: '文創手作',
    registeredAt: '2026/05/29 13:50',
    status: ApplicationStatus.refundPending,
  },
  {
    id: 6,
    activity: '植感生活市集',
    activityImage: 'assets/images/market/cards/market-card-06.png',
    activityTime: '2026/08/15 - 2026/08/16',
    brandName: '山系日常',
    vendorName: '吳小山',
    brandType: '文創手作',
    registeredAt: '2026/05/28 11:20',
    status: ApplicationStatus.completed,
  },
  {
    id: 7,
    activity: '烘焙陶作午後市集',
    activityImage: 'assets/images/market/cards/market-card-07.png',
    activityTime: '2026/09/05 - 2026/09/06',
    brandName: '好好生活',
    vendorName: '李好好',
    brandType: '生活選物',
    registeredAt: '2026/05/27 15:10',
    status: ApplicationStatus.refunding,
  },
  {
    id: 8,
    activity: '草地親子手作日',
    activityImage: 'assets/images/market/cards/market-card-08.png',
    activityTime: '2026/09/19 - 2026/09/20',
    brandName: '簡單手作',
    vendorName: '簡小單',
    brandType: '文創手作',
    registeredAt: '2026/05/25 18:30',
    status: ApplicationStatus.refunded,
  },
  {
    id: 9,
    activity: '月光手作夜市集',
    activityImage: 'assets/images/market/cards/market-card-09.png',
    activityTime: '2026/10/03 - 2026/10/04',
    brandName: '拾甜甜點',
    vendorName: '王小拾',
    brandType: '餐飲美食',
    registeredAt: '2026/05/24 12:10',
    status: ApplicationStatus.cancelled,
  },
  {
    id: 10,
    activity: '海風編織選物市集',
    activityImage: 'assets/images/market/cards/market-card-10.png',
    activityTime: '2026/11/14 - 2026/11/15',
    brandName: '木作小室',
    vendorName: '許木木',
    brandType: '文創手作',
    registeredAt: '2026/05/22 09:40',
    status: ApplicationStatus.pendingReview,
  },
  {
    id: 11,
    activity: '春日野餐市集',
    activityImage: 'assets/images/market/cards/market-card-11.png',
    activityTime: '2026/04/11 - 2026/04/12',
    brandName: '花見小物',
    vendorName: '林花見',
    brandType: '生活選物',
    registeredAt: '2026/04/01 09:30',
    status: ApplicationStatus.depositReturned,
  },
];

@Component({
  selector: 'app-organizer-dashboard-registration-detail',
  imports: [RouterLink],
  templateUrl: './organizer-dashboard-registration-detail.html',
  styleUrl: './organizer-dashboard-registration-detail.scss',
})
export class OrganizerDashboardRegistrationDetail implements OnInit {
  readonly ApplicationStatus = ApplicationStatus;

  returnPage = 1;
  returnStatus = '';
  detail: OrganizerRegistrationDetail = this.createDetail(registrationRows[0], registrationRows[0].status);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  // 進入詳情頁時讀取列表帶來的 id、狀態與返回資訊。
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const status = this.route.snapshot.queryParamMap.get('status');
    const returnPage = Number(this.route.snapshot.queryParamMap.get('returnPage'));
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';

    if (Number.isInteger(returnPage) && returnPage > 0) {
      this.returnPage = returnPage;
    }

    this.detail = this.getDetail(id, status);
  }

  get statusClass(): string {
    return ApplicationStatus.getClass(this.detail.status);
  }

  // 依目前報名狀態決定頁首可操作按鈕，避免每個狀態在 template 裡分散判斷。
  get pageActions(): OrganizerRegistrationDetailAction[] {
    switch (this.detail.status) {
      case ApplicationStatus.pendingReview:
        return [
          { label: '審核不通過', icon: 'bi-x-lg', variant: 'outline' },
          { label: '審核通過', icon: 'bi-check-lg', variant: 'primary' },
        ];
      case ApplicationStatus.completed:
        return [
          { label: '保證金退還', variant: 'primary' },
        ];
      case ApplicationStatus.refundPending:
        return [
          { label: '前往收款管理', icon: 'bi-cash-coin', variant: 'primary' },
        ];
      default:
        return [];
    }
  }

  // 狀態紀錄會隨報名流程不同而變化，集中在這裡組給畫面使用。
  get statusRecords(): OrganizerRegistrationStatusRecordItem[] {
    const times = this.detail.times;

    switch (this.detail.status) {
      case ApplicationStatus.reviewRejected:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
        ]);
      case ApplicationStatus.cancelled:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '取消時間', value: times.cancelledAt },
        ]);
      case ApplicationStatus.refundPending:
      case ApplicationStatus.refunding:
      case ApplicationStatus.refunded:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
          { label: '退款申請時間', value: times.refundRequestedAt },
          { label: '退款審核時間', value: times.refundReviewedAt },
          { label: '退款完成時間', value: times.refundedAt },
        ]);
      default:
        return this.presentStatusRecords([
          { label: '報名日期', value: times.registeredAt },
          { label: '審核時間', value: times.reviewedAt },
          { label: '付款時間', value: times.paidAt },
          { label: '攤位完成時間', value: times.selectedAt },
          { label: '最終確認時間', value: times.finalConfirmedAt },
          { label: '保證金退還', value: times.depositReturnedAt },
        ]);
    }
  }

  private presentStatusRecords(
    records: Array<{ label: string; value?: string }>,
  ): OrganizerRegistrationStatusRecordItem[] {
    return records.filter((record): record is OrganizerRegistrationStatusRecordItem => Boolean(record.value));
  }

  // 返回報名管理時帶回原本頁碼與篩選狀態。
  goBack(): void {
    this.router.navigate(['/organizer/dash-board/register'], {
      queryParams: {
        page: this.returnPage,
        status: this.returnStatus || null,
      },
    });
  }

  // 依列表 id 取得詳情資料；query status 只作為目前靜態展示不同狀態的輔助。
  private getDetail(id: number, statusFromQuery: string | null): OrganizerRegistrationDetail {
    const row = registrationRows.find((item) => item.id === id) ?? registrationRows[0];
    const status = statusFromQuery && ApplicationStatus.list.includes(statusFromQuery)
      ? statusFromQuery
      : row.status;

    return this.createDetail(row, status);
  }

  // 將列表資料補齊成詳情頁需要的完整結構，日後可對應後端回傳格式調整。
  private createDetail(row: OrganizerRegistrationDetailSeed, status: string): OrganizerRegistrationDetail {
    const detail: OrganizerRegistrationDetail = {
      id: row.id,
      status,
      registrationNo: `REG2022060100${String(row.id).padStart(2, '0')}`,
      activity: {
        name: row.activity,
        image: row.activityImage,
        date: row.activityTime,
        location: this.getActivityLocation(row.id),
        address: this.getActivityAddress(row.id),
      },
      vendor: {
        name: row.vendorName,
        phone: this.getVendorPhone(row.id),
        email: this.getVendorEmail(row.id),
        address: this.getVendorAddress(row.id),
      },
      brand: {
        name: row.brandName,
        type: row.brandType,
        image: this.getBrandLogo(row.id),
        description: this.getBrandDescription(row.brandName),
      },
      registration: {
        period: this.getRegistrationPeriod(row.activityTime),
        boothSpec: '長 2 公尺 × 寬 3 公尺 × 高 2 公尺',
        boothCategories: this.getBoothCategories(row.brandType),
        rentalEquipment: '現場用電、每攤 900 瓦 $50/天',
      },
      fee: {
        boothFee: 'NT$2,500',
        electricityFee: 'NT$100',
        deposit: 'NT$1,000',
        total: 'NT$3,600',
      },
      times: {
        registeredAt: row.registeredAt,
      },
    };

    return this.applyStatus(detail);
  }

  // 活動地點目前由靜態 id 對照，後續串 API 後可移除。
  private getActivityLocation(id: number): string {
    const locations: Record<number, string> = {
      1: '台北市 信義區 香堤大道廣場',
      2: '新北市 淡水區 河岸藝文廣場',
      3: '台中市 西區 草悟道市集廣場',
      4: '台南市 中西區 藍晒圖文創園區',
      5: '桃園市 中壢區 中央公園草地',
      6: '高雄市 鹽埕區 駁二藝術特區',
      7: '台北市 松山區 文創園區廣場',
      8: '新竹市 東區 關新公園草地',
      9: '台中市 北區 月光廣場',
      10: '基隆市 中正區 海洋廣場',
      11: '台北市 大安區 森林公園草地',
    };

    return locations[id] ?? '台北市 信義區 香堤大道廣場';
  }

  private getActivityAddress(id: number): string {
    const addresses: Record<number, string> = {
      1: '台北市信義區松壽路與松智路口',
      2: '新北市淡水區中正路 1 號',
      3: '台中市西區中興街與公益路口',
      4: '台南市中西區西門路一段 689 巷',
      5: '桃園市中壢區中央西路二段 30 號',
      6: '高雄市鹽埕區大勇路 1 號',
      7: '台北市信義區光復南路 133 號',
      8: '新竹市東區關新路 188 號',
      9: '台中市北區三民路三段 161 號',
      10: '基隆市中正區港西街 5 號',
      11: '台北市大安區新生南路二段 1 號',
    };

    return addresses[id] ?? '台北市信義區松壽路與松智路口';
  }

  // 以下攤主與品牌資料先依列表 id 產生，讓詳情頁資料可與列表一致。
  private getVendorPhone(id: number): string {
    return `09${String(12000000 + id * 34567).slice(0, 8)}`;
  }

  private getVendorEmail(id: number): string {
    const row = registrationRows.find((item) => item.id === id) ?? registrationRows[0];
    return `vendor${String(row.id).padStart(2, '0')}@marketday.tw`;
  }

  private getVendorAddress(id: number): string {
    const addresses: Record<number, string> = {
      1: '台北市信義區市集路 81 號',
      2: '新北市淡水區河岸路 82 號',
      3: '台中市西區草悟路 83 號',
      4: '台南市中西區文創路 84 號',
      5: '桃園市中壢區中央路 85 號',
      6: '高雄市鹽埕區駁二路 86 號',
      7: '台北市松山區文創路 87 號',
      8: '新竹市東區關新路 88 號',
      9: '台中市北區月光路 89 號',
      10: '基隆市中正區海洋路 90 號',
      11: '台北市大安區森林路 91 號',
    };

    return addresses[id] ?? '台北市信義區市集路 81 號';
  }

  private getBrandLogo(id: number): string {
    const brandId = String(((id - 1) % 8) + 1).padStart(2, '0');
    return `assets/images/user/brand/brands/brand-${brandId}/logo.png`;
  }

  private getBrandDescription(brandName: string): string {
    return `${brandName} 專注於具有溫度的選物與手作作品，希望在市集中和更多人分享日常裡的小美好。`;
  }

  private getRegistrationPeriod(activityTime: string): string {
    const [startDate, endDate] = activityTime.split(' - ');
    return `${startDate} 13:30 - 20:30、${endDate} 13:30 - 20:30`;
  }

  private getBoothCategories(brandType: string): string {
    return brandType === '餐飲美食'
      ? '餐飲美食、烘焙甜點、飲品輕食'
      : `${brandType}、生活選物、文創手作`;
  }

  // 依不同報名狀態補上流程時間與原因資料，讓畫面呈現符合實際流程。
  private applyStatus(detail: OrganizerRegistrationDetail): OrganizerRegistrationDetail {
    switch (detail.status) {
      case ApplicationStatus.reviewRejected:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
          },
          reason: {
            title: '審核未通過原因',
            subtitle: '攤位類別不符合',
            description: '您申請的攤位類別與本活動開放類別不符，請重新選擇符合的攤位類別後再提交報名。',
          },
        };
      case ApplicationStatus.pendingPayment:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
          },
        };
      case ApplicationStatus.pendingSelection:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            paidAt: '2026/06/03 16:50',
          },
        };
      case ApplicationStatus.completed:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            paidAt: '2026/06/03 16:50',
            selectedAt: '2026/06/05 14:33',
          },
        };
      case ApplicationStatus.depositReturned:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            paidAt: '2026/06/03 16:50',
            selectedAt: '2026/06/05 14:33',
            finalConfirmedAt: '2026/06/22 10:00',
            depositReturnedAt: '2026/06/23 15:20',
          },
        };
      case ApplicationStatus.refundPending:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            paidAt: '2026/06/03 11:20',
            refundRequestedAt: '2026/06/10 15:22',
          },
        };
      case ApplicationStatus.refunding:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            paidAt: '2026/06/03 11:20',
            refundRequestedAt: '2026/06/10 15:22',
            refundReviewedAt: '2026/06/11 18:22',
          },
        };
      case ApplicationStatus.refunded:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            paidAt: '2026/06/03 11:20',
            refundRequestedAt: '2026/06/10 15:22',
            refundReviewedAt: '2026/06/11 18:22',
            refundedAt: '2026/06/13 09:56',
          },
        };
      case ApplicationStatus.cancelled:
        return {
          ...detail,
          times: {
            ...detail.times,
            reviewedAt: '2026/06/02 15:30',
            cancelledAt: '2026/06/08 10:00',
          },
          reason: {
            title: '取消原因',
            subtitle: '付款逾期失效',
            description: '因未於付款期限內完成付款，系統已自動取消報名。',
          },
        };
      default:
        return detail;
    }
  }
}
