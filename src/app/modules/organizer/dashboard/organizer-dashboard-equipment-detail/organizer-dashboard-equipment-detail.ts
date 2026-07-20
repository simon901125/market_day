import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { OrganizerEquipmentDetailResponse } from '../../../../models/interface/organizer/OrganizerOperations';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

interface InfoRow { label: string; value: string; type?: 'status'; }
interface OverviewItem { label: string; value: string; unit: string; }
interface TableColumn { key: string; label: string; align?: 'start' | 'center' | 'end'; }
type TableRow = Record<string, string>;
interface EquipmentDetailData {
  id: number; title: string; image: string; activityRows: InfoRow[]; overviewItems: OverviewItem[];
  equipmentSettings: TableRow[]; basePowerSettings: TableRow[]; extraPowerSettings: TableRow[];
  equipmentStats: TableRow[]; extraPowerStats: TableRow[]; vehicleStats: TableRow[];
  rentalRows: TableRow[]; extraPowerRows: TableRow[]; vehicleRows: TableRow[];
}

@Component({ selector: 'app-organizer-dashboard-equipment-detail', imports: [RouterLink, DashboardPagination], templateUrl: './organizer-dashboard-equipment-detail.html', styleUrl: './organizer-dashboard-equipment-detail.scss' })
/** 設備詳情頁，分頁呈現設備與車牌資料並提供報表下載。 */
export class OrganizerDashboardEquipmentDetail implements OnInit {
  eventId = 0;
  returnPage = 1;
  returnStatus = '';
  readonly detailPageSize = 5;
  rentalCurrentPage = 1;
  extraPowerCurrentPage = 1;
  vehicleCurrentPage = 1;
  rentalTotalItems = 0;
  extraPowerTotalItems = 0;
  vehicleTotalItems = 0;

  readonly equipmentColumns: TableColumn[] = [
    { key: 'name', label: '設備名稱' }, { key: 'spec', label: '設備規格' }, { key: 'unit', label: '單位', align: 'center' },
    { key: 'free', label: '免費提供', align: 'center' }, { key: 'rentalStatus', label: '租借狀態', align: 'center' },
    { key: 'limit', label: '每攤租借上限', align: 'center' }, { key: 'dailyTotal', label: '每日可租借總數', align: 'center' },
  ];
  readonly basePowerColumns: TableColumn[] = [{ key: 'voltage', label: '電壓類型' }, { key: 'freePower', label: '免費提供', align: 'center' }];
  readonly extraPowerColumns: TableColumn[] = [{ key: 'plan', label: '用電方案' }, { key: 'dailyTotal', label: '每日可租借組數', align: 'center' }];
  readonly equipmentStatsColumns: TableColumn[] = [{ key: 'name', label: '設備名稱' }, { key: 'used', label: '已租借 / 可租借', align: 'center' }, { key: 'remaining', label: '剩餘', align: 'center' }];
  readonly extraPowerStatsColumns: TableColumn[] = [{ key: 'plan', label: '用電方案' }, { key: 'quantity', label: '申請數量', align: 'center' }];
  readonly vehicleStatsColumns: TableColumn[] = [{ key: 'status', label: '狀態' }, { key: 'quantity', label: '數量', align: 'center' }];
  rentalColumns: TableColumn[] = [{ key: 'boothNo', label: '攤位編號', align: 'center' }, { key: 'brandName', label: '品牌名稱' }];
  readonly extraPowerManageColumns: TableColumn[] = [{ key: 'boothNo', label: '攤位編號', align: 'center' }, { key: 'brandName', label: '品牌名稱' }, { key: 'plan', label: '用電方案' }];
  readonly vehicleColumns: TableColumn[] = [{ key: 'boothNo', label: '攤位編號', align: 'center' }, { key: 'brandName', label: '品牌名稱' }, { key: 'contact', label: '聯絡人' }, { key: 'plateNo', label: '車牌號碼', align: 'center' }];

  detail: EquipmentDetailData = {
    id: 0, title: '-', image: 'assets/images/market/cards/market-card-01.png', activityRows: [], overviewItems: [],
    equipmentSettings: [], basePowerSettings: [], extraPowerSettings: [], equipmentStats: [], extraPowerStats: [], vehicleStats: [],
    rentalRows: [], extraPowerRows: [], vehicleRows: [],
  };

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly organizerApi: OrganizerApiService) {}

  /** 驗證活動 ID、還原列表狀態，並載入各設備分頁資料。 */
  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.returnPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('returnPage')) || 1);
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';
    if (this.eventId > 0) void this.loadDetail();
  }

  get pagedRentalRows(): TableRow[] { return this.detail.rentalRows; }
  get pagedExtraPowerRows(): TableRow[] { return this.detail.extraPowerRows; }
  get pagedVehicleRows(): TableRow[] { return this.detail.vehicleRows; }
  goBack(): void { this.router.navigate(['/organizer/dash-board/equipment'], { queryParams: { page: this.returnPage, status: this.returnStatus || null } }); }
  getStatusClass(status: string): string { return ActivityStatus.getClass(status); }
  onRentalPageChange(page: number): void { this.rentalCurrentPage = page; void this.loadDetail(); }
  onExtraPowerPageChange(page: number): void { this.extraPowerCurrentPage = page; void this.loadDetail(); }
  onVehiclePageChange(page: number): void { this.vehicleCurrentPage = page; void this.loadDetail(); }

  /** 下載後端產生的設備管理 Excel 報表。 */
  async downloadEquipmentReport(): Promise<void> {
    const blob = await firstValueFrom(this.organizerApi.downloadOrganizerEquipmentReport(this.eventId));
    this.saveBlob(blob, `設備報表-${this.detail.title}.xlsx`);
  }

  /** 依三個區塊各自的頁碼取得最新設備詳情。 */
  private async loadDetail(): Promise<void> {
    try {
      const response = await firstValueFrom(this.organizerApi.getOrganizerEquipmentDetail(this.eventId, {
        equipmentRentalPage: this.rentalCurrentPage, equipmentRentalPageSize: this.detailPageSize,
        extraPowerPage: this.extraPowerCurrentPage, extraPowerPageSize: this.detailPageSize,
        vehiclePage: this.vehicleCurrentPage, vehiclePageSize: this.detailPageSize,
      }));
      this.applyResponse(response.data);
    } catch {
      this.detail.rentalRows = []; this.detail.extraPowerRows = []; this.detail.vehicleRows = [];
    }
  }

  /** 將設備租借、額外用電與車牌資料分別套用到畫面區塊。 */
  private applyResponse(data: OrganizerEquipmentDetailResponse): void {
    const e = data.event; const overview = data.equipmentOverview;
    const status = ActivityStatus.fromApiStatus(this.text(e['status']));
    this.rentalTotalItems = data.equipmentRentalManagement?.totalItems ?? data.equipmentRentalManagement?.totalCount ?? 0;
    this.extraPowerTotalItems = data.extraPowerManagement?.totalItems ?? data.extraPowerManagement?.totalCount ?? 0;
    this.vehicleTotalItems = data.vehicleManagement?.totalItems ?? data.vehicleManagement?.totalCount ?? 0;
    const equipmentNames = [...new Set((data.eventEquipments ?? []).map((item) => this.text(item['equipmentName'])).filter(Boolean))];
    this.rentalColumns = [{ key: 'boothNo', label: '攤位編號', align: 'center' }, { key: 'brandName', label: '品牌名稱' }, ...equipmentNames.map((name, index) => ({ key: `equipment${index}`, label: name, align: 'center' as const }))];
    this.detail = {
      id: this.eventId,
      title: this.text(e['eventTitle']) || '-',
      image: this.text(e['coverImageUrl']) || 'assets/images/market/cards/market-card-01.png',
      activityRows: [
        { label: '活動狀態', value: status || '-', type: 'status' }, { label: '活動時間', value: this.text(e['eventTime']) || '-' },
        { label: '活動地點', value: this.text(e['locationName']) || '-' }, { label: '活動地址', value: this.text(e['address']) || '-' },
      ],
      overviewItems: [
        ['報名攤數', 'registeredStallCount', '攤'], ['基本設備', 'basicEquipmentCount', '件'], ['基本用電', 'basicPowerCount', '組'],
        ['租借設備', 'equipmentRentalCount', '件'], ['額外用電', 'extraPowerCount', '組'], ['車牌登記', 'vehicleRegistrationCount', '台'],
      ].map(([label, key, unit]) => ({ label, value: String(overview[key] ?? 0), unit })),
      equipmentSettings: (data.eventEquipments ?? []).map((row) => ({
        name: this.text(row['equipmentName']) || '-', spec: this.text(row['description']) || '-', unit: this.text(row['unit']) || '-',
        free: String(row['freeProvided'] ?? 0), rentalStatus: this.text(row['rentalStatus']) || (this.number(row['paidRentalFee']) > 0 ? '開放' : '未開放'),
        limit: String(row['perStallRentalLimit'] ?? '-'), dailyTotal: String(row['dailyRentableQuantity'] ?? '-'),
      })),
      basePowerSettings: (data.basicPowers ?? []).map((row) => ({ voltage: this.text(row['voltageType']) || '-', freePower: this.text(row['freeWattage']) || '-' })),
      extraPowerSettings: (data.extraPowers ?? []).map((row) => ({ plan: this.text(row['powerPlan']) || '-', dailyTotal: String(row['availableGroupQuantity'] ?? 0) })),
      equipmentStats: (data.equipmentRentalStatistics ?? []).map((row) => ({ name: this.text(row['equipmentName']) || (row['isTotal'] ? '總計' : '-'), used: this.text(row['rentedText']) || `${row['rentedQuantity'] ?? 0} / ${row['rentableQuantity'] ?? 0}`, remaining: String(row['remainingQuantity'] ?? 0) })),
      extraPowerStats: (data.extraPowerApplicationStatistics ?? []).map((row) => ({ plan: this.text(row['equipmentName']) || this.text(row['powerPlan']) || (row['isTotal'] ? '總計' : '-'), quantity: String(row['applicationQuantity'] ?? 0) })),
      vehicleStats: this.vehicleStats(data.vehicleRegistrationStatistics ?? {}),
      rentalRows: (data.equipmentRentalManagement?.items ?? []).map((row) => this.rentalRow(row, equipmentNames)),
      extraPowerRows: (data.extraPowerManagement?.items ?? []).map((row) => ({ boothNo: this.text(row['stallNo']) || '-', brandName: this.text(row['brandName']) || '-', plan: this.text(row['powerPlan']) || '-' })),
      vehicleRows: (data.vehicleManagement?.items ?? []).map((row) => ({ boothNo: this.text(row['stallNo']) || '-', brandName: this.text(row['brandName']) || '-', contact: this.text(row['contactName']) || '-', plateNo: this.text(row['vehicleNo']) || '-' })),
    };
  }

  private rentalRow(row: Record<string, unknown>, names: string[]): TableRow {
    const quantities = (row['equipmentQuantities'] ?? {}) as Record<string, unknown>;
    return { boothNo: this.text(row['stallNo']) || '-', brandName: this.text(row['brandName']) || '-', ...Object.fromEntries(names.map((name, index) => [`equipment${index}`, String(quantities[name] ?? '-')])) };
  }
  private vehicleStats(stats: Record<string, number>): TableRow[] { const registered = stats['registeredCount'] ?? 0; const total = stats['stallCount'] ?? 0; return [{ status: '已登記車牌', quantity: String(registered) }, { status: '未登記車牌', quantity: String(stats['unregisteredCount'] ?? Math.max(0, total - registered)) }, { status: '總計', quantity: String(total) }]; }
  private text(value: unknown): string { return value == null ? '' : String(value); }
  private number(value: unknown): number { const parsed = Number(value); return Number.isFinite(parsed) ? parsed : 0; }
  private saveBlob(blob: Blob, filename: string): void { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url); }
}
