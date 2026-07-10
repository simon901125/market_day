import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

interface InfoRow {
  label: string;
  value: string;
  type?: 'status';
}

interface OverviewItem {
  label: string;
  value: string;
  unit: string;
}

interface TableColumn {
  key: string;
  label: string;
  align?: 'start' | 'center' | 'end';
}

type TableRow = Record<string, string>;

interface EquipmentDetailData {
  id: number;
  title: string;
  image: string;
  activityRows: InfoRow[];
  overviewItems: OverviewItem[];
  equipmentSettings: TableRow[];
  basePowerSettings: TableRow[];
  extraPowerSettings: TableRow[];
  equipmentStats: TableRow[];
  extraPowerStats: TableRow[];
  vehicleStats: TableRow[];
  rentalRows: TableRow[];
  extraPowerRows: TableRow[];
  vehicleRows: TableRow[];
}

@Component({
  selector: 'app-organizer-dashboard-equipment-detail',
  imports: [RouterLink, DashboardPagination],
  templateUrl: './organizer-dashboard-equipment-detail.html',
  styleUrl: './organizer-dashboard-equipment-detail.scss',
})
export class OrganizerDashboardEquipmentDetail implements OnInit {
  returnPage = 1;
  returnStatus = '';
  detailPageSize = 6;
  rentalCurrentPage = 1;
  extraPowerCurrentPage = 1;
  vehicleCurrentPage = 1;

  readonly equipmentColumns: TableColumn[] = [
    { key: 'name', label: '設備名稱' },
    { key: 'spec', label: '設備規格' },
    { key: 'unit', label: '單位', align: 'center' },
    { key: 'free', label: '免費提供', align: 'center' },
    { key: 'rentalStatus', label: '租借狀態', align: 'center' },
    { key: 'limit', label: '每攤租借上限', align: 'center' },
    { key: 'dailyTotal', label: '每日可租借總數', align: 'center' },
  ];

  readonly basePowerColumns: TableColumn[] = [
    { key: 'voltage', label: '電壓類型' },
    { key: 'freePower', label: '免費提供', align: 'center' },
  ];

  readonly extraPowerColumns: TableColumn[] = [
    { key: 'plan', label: '用電方案' },
    { key: 'dailyTotal', label: '每日可租借組數', align: 'center' },
  ];

  readonly equipmentStatsColumns: TableColumn[] = [
    { key: 'name', label: '設備名稱' },
    { key: 'used', label: '已租借 / 可租借', align: 'center' },
    { key: 'remaining', label: '剩餘', align: 'center' },
  ];

  readonly extraPowerStatsColumns: TableColumn[] = [
    { key: 'plan', label: '用電方案' },
    { key: 'quantity', label: '申請數量', align: 'center' },
  ];

  readonly vehicleStatsColumns: TableColumn[] = [
    { key: 'status', label: '狀態' },
    { key: 'quantity', label: '數量', align: 'center' },
  ];

  readonly rentalColumns: TableColumn[] = [
    { key: 'boothNo', label: '攤位編號', align: 'center' },
    { key: 'brandName', label: '品牌名稱' },
    { key: 'table', label: '桌子（可租 2）', align: 'center' },
    { key: 'chair', label: '椅子（可租 4）', align: 'center' },
    { key: 'extension', label: '延長線（可租 1）', align: 'center' },
  ];

  readonly extraPowerManageColumns: TableColumn[] = [
    { key: 'boothNo', label: '攤位編號', align: 'center' },
    { key: 'brandName', label: '品牌名稱' },
    { key: 'plan', label: '用電方案' },
  ];

  readonly vehicleColumns: TableColumn[] = [
    { key: 'boothNo', label: '攤位編號', align: 'center' },
    { key: 'brandName', label: '品牌名稱' },
    { key: 'contact', label: '聯絡人' },
    { key: 'plateNo', label: '車牌號碼', align: 'center' },
  ];

  detail: EquipmentDetailData = {
    id: 1,
    title: '新勤市集・貓貓森林市',
    image: 'assets/images/market/cards/market-card-01.png',
    activityRows: [
      { label: '活動狀態', value: ActivityStatus.active, type: 'status' },
      { label: '活動時間', value: '2026/05/30 10:00 ~ 2026/05/31 18:00' },
      { label: '活動地點', value: '宜蘭縣頭城鎮明明天天園森林廣場' },
      { label: '活動地址', value: '宜蘭縣宜蘭市中興路二段 1 號' },
    ],
    overviewItems: [
      { label: '報名攤數', value: '142', unit: '攤' },
      { label: '基本設備', value: '130', unit: '件' },
      { label: '基本用電', value: '142', unit: '組' },
      { label: '租借設備', value: '186', unit: '件' },
      { label: '額外用電', value: '26', unit: '組' },
      { label: '車牌登記', value: '118', unit: '台' },
    ],
    equipmentSettings: [
      { name: '桌子', spec: '180 × 60 × 75 cm', unit: '張', free: '1', rentalStatus: '開放', limit: '2', dailyTotal: '30' },
      { name: '椅子', spec: '一般塑膠椅', unit: '張', free: '2', rentalStatus: '開放', limit: '4', dailyTotal: '80' },
      { name: '延長線', spec: '5 公尺', unit: '條', free: '0', rentalStatus: '開放', limit: '1', dailyTotal: '20' },
    ],
    basePowerSettings: [
      { voltage: '110V', freePower: '500W' },
      { voltage: '220V', freePower: '2000W' },
    ],
    extraPowerSettings: [
      { plan: '110V / 1000W', dailyTotal: '20' },
      { plan: '220V / 3000W', dailyTotal: '10' },
    ],
    equipmentStats: [
      { name: '桌子', used: '24 / 30', remaining: '6' },
      { name: '椅子', used: '63 / 80', remaining: '17' },
      { name: '延長線', used: '18 / 20', remaining: '2' },
      { name: '總計', used: '105 / 130', remaining: '25' },
    ],
    extraPowerStats: [
      { plan: '110V / 1000W', quantity: '16' },
      { plan: '220V / 3000W', quantity: '8' },
      { plan: '總計', quantity: '24' },
    ],
    vehicleStats: [
      { status: '已登記車牌', quantity: '118' },
      { status: '未登記車牌', quantity: '24' },
      { status: '總計', quantity: '142' },
    ],
    rentalRows: [
      { boothNo: 'A01', brandName: 'Coffee Time', table: '1', chair: '2', extension: '-' },
      { boothNo: 'A02', brandName: '貓貓手作', table: '2', chair: '1', extension: '1' },
      { boothNo: 'A03', brandName: '森活小舖', table: '1', chair: '-', extension: '1' },
      { boothNo: 'A05', brandName: 'Burger House', table: '-', chair: '1', extension: '1' },
      { boothNo: 'A06', brandName: '祖帽手作', table: '1', chair: '1', extension: '-' },
      { boothNo: 'A08', brandName: '手作體驗', table: '1', chair: '1', extension: '1' },
      { boothNo: 'A09', brandName: '日光咖啡', table: '1', chair: '2', extension: '-' },
      { boothNo: 'A10', brandName: '山系日常', table: '2', chair: '4', extension: '1' },
      { boothNo: 'A11', brandName: '微景設計', table: '-', chair: '2', extension: '-' },
      { boothNo: 'A12', brandName: '木木皮革', table: '1', chair: '-', extension: '1' },
      { boothNo: 'A13', brandName: '好好生活', table: '1', chair: '2', extension: '-' },
      { boothNo: 'A14', brandName: '暖暖花室', table: '2', chair: '2', extension: '1' },
    ],
    extraPowerRows: [
      { boothNo: 'A01', brandName: 'Coffee Time', plan: '110V / 1000W、220V / 3000W' },
      { boothNo: 'A03', brandName: 'Burger House', plan: '220V / 3000W' },
      { boothNo: 'A07', brandName: '森活小舖', plan: '110V / 1000W、220V / 3000W' },
      { boothNo: 'A11', brandName: '祖帽手作', plan: '220V / 3000W' },
      { boothNo: 'A12', brandName: '花見甜點', plan: '110V / 1000W' },
      { boothNo: 'A13', brandName: '祖帽植物', plan: '110V / 1000W' },
      { boothNo: 'A15', brandName: '祖帽手作', plan: '110V / 1000W' },
      { boothNo: 'A16', brandName: '手作體驗', plan: '220V / 3000W' },
    ],
    vehicleRows: [
      { boothNo: 'A01', brandName: 'Coffee Time', contact: '王小明', plateNo: 'ABC-1234' },
      { boothNo: 'A02', brandName: '貓貓手作', contact: '李美美', plateNo: 'BCA-5678' },
      { boothNo: 'A03', brandName: 'Burger House', contact: '張大同', plateNo: 'AAA-8888' },
      { boothNo: 'A05', brandName: '森活小舖', contact: '陳小婷', plateNo: 'XYZ-9999' },
      { boothNo: 'A06', brandName: '花見甜點', contact: '林小美', plateNo: '1234-AB' },
      { boothNo: 'A07', brandName: '祖帽手作', contact: '黃小杰', plateNo: '8899-ZZ' },
      { boothNo: 'A08', brandName: '手作體驗', contact: '劉小花', plateNo: '1122-CC' },
      { boothNo: 'A09', brandName: '玩具植物', contact: '鄭小玲', plateNo: '5566-DD' },
    ],
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const pageFromUrl = Number(this.route.snapshot.queryParamMap.get('returnPage'));
    this.returnStatus = this.route.snapshot.queryParamMap.get('returnStatus') ?? '';

    if (Number.isInteger(pageFromUrl) && pageFromUrl > 0) {
      this.returnPage = pageFromUrl;
    }
  }

  get pagedRentalRows(): TableRow[] {
    return this.getPagedRows(this.detail.rentalRows, this.rentalCurrentPage);
  }

  get pagedExtraPowerRows(): TableRow[] {
    return this.getPagedRows(this.detail.extraPowerRows, this.extraPowerCurrentPage);
  }

  get pagedVehicleRows(): TableRow[] {
    return this.getPagedRows(this.detail.vehicleRows, this.vehicleCurrentPage);
  }

  goBack(): void {
    this.router.navigate(['/organizer/dash-board/equipment'], {
      queryParams: {
        page: this.returnPage,
        status: this.returnStatus || null,
      },
    });
  }

  getStatusClass(status: string): string {
    return ActivityStatus.getClass(status);
  }

  downloadEquipmentReport(): void {
    // TODO: 串接設備報表匯出 API 或前端 Excel 產生流程。
  }

  onRentalPageChange(page: number): void {
    this.rentalCurrentPage = page;
  }

  onExtraPowerPageChange(page: number): void {
    this.extraPowerCurrentPage = page;
  }

  onVehiclePageChange(page: number): void {
    this.vehicleCurrentPage = page;
  }

  private getPagedRows(rows: TableRow[], page: number): TableRow[] {
    const startIndex = (page - 1) * this.detailPageSize;
    return rows.slice(startIndex, startIndex + this.detailPageSize);
  }
}
