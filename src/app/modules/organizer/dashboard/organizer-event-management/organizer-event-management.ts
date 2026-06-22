import { Component, OnInit } from '@angular/core';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { DateRangeSelector } from '../../../shared/date-range-selector/date-range-selector';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { OrganizerEventRow } from '../../../../models/interface/OrganizerEventRow';
import { DashboardDataTable, DashboardTableAction, DashboardTableColumn } from '../../../shared/dashboard/dashboard-data-table/dashboard-data-table';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';

@Component({
  selector: 'app-organizer-event-management',
  imports: [DashboardDataTable, DashboardPagination, Dropdown, DateRangeSelector],
  templateUrl: './organizer-event-management.html',
  styleUrl: './organizer-event-management.scss',
})
/** 主辦方後台活動管理頁 */
export class OrganizerEventManagement implements OnInit {
  /** 目前分頁頁碼 */
  currentPage = 1;
  /** 每頁顯示筆數 */
  pageSize = 6;
  /** 目前選取的狀態篩選 */
  selectedStatus = '';
  /** 狀態篩選選項 */
  readonly statusOptions = ActivityStatus.filterList;

  /** 活動管理表格欄位設定 */
  columns: DashboardTableColumn[] = [
    { key: 'name', label: '活動名稱', type: 'imageText' },
    { key: 'date', label: '活動日期' },
    { key: 'location', label: '活動地點' },
    { key: 'status', label: '狀態', type: 'status', align: 'center' },
    { key: 'signupProgress', label: '報名進度', align: 'center' },
    { key: 'paidCount', label: '已付款', align: 'center' },
    { key: 'action', label: '操作', type: 'action', align: 'center' },
  ];

  /** 活動管理假資料，之後可替換成 API 回傳資料 */
  rows: OrganizerEventRow[] = [
    {
      id: 1,
      name: '夏日親子市集',
      nameImage: 'assets/images/market/cards/market-card-01.png',
      date: '2026/06/15 - 2026/06/21',
      location: '台中市西區 草悟廣場',
      status: ActivityStatus.active,
      signupProgress: '128 / 150',
      paidCount: '118',
      actionLabel: '查看詳情',
    },
    {
      id: 2,
      name: '台北手作生活節',
      nameImage: 'assets/images/market/cards/market-card-02.png',
      date: '2026/06/27 - 2026/06/28',
      location: '台北市中正區 華山1914文創園區',
      status: ActivityStatus.registrationOpen,
      signupProgress: '96 / 120',
      paidCount: '82',
      actionLabel: '查看詳情',
    },
    {
      id: 3,
      name: '巷弄甜點花草市集',
      nameImage: 'assets/images/market/cards/market-card-03.png',
      date: '2026/07/04 - 2026/07/05',
      location: '台北市松山區 文創廣場',
      status: ActivityStatus.registrationOpen,
      signupProgress: '86 / 100',
      paidCount: '74',
      actionLabel: '查看詳情',
    },
    {
      id: 4,
      name: '台南文創手作日',
      nameImage: 'assets/images/market/cards/market-card-04.png',
      date: '2026/07/18 - 2026/07/19',
      location: '台南市中西區 河樂廣場',
      status: ActivityStatus.readyToPublish,
      signupProgress: '64 / 90',
      paidCount: '58',
      actionLabel: '查看詳情',
    },
    {
      id: 5,
      name: '高雄寵物友善市集',
      nameImage: 'assets/images/market/cards/market-card-05.png',
      date: '2026/08/01 - 2026/08/02',
      location: '高雄市鹽埕區 駁二藝術特區',
      status: ActivityStatus.mapBuilding,
      signupProgress: '72 / 100',
      paidCount: '66',
      actionLabel: '查看詳情',
    },
    {
      id: 6,
      name: '森林植感花園市集',
      nameImage: 'assets/images/market/cards/market-card-06.png',
      date: '2026/08/15 - 2026/08/16',
      location: '台中市西區 勤美綠園道',
      status: ActivityStatus.pendingReview,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 7,
      name: '秋夜手作星光市集',
      nameImage: 'assets/images/market/cards/market-card-07.png',
      date: '2026/09/05 - 2026/09/06',
      location: '台北市信義區 香堤大道',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 8,
      name: '桃園親子遊樂市集',
      nameImage: 'assets/images/market/cards/market-card-08.png',
      date: '2026/09/19 - 2026/09/20',
      location: '桃園市中壢區 青埔公園',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 9,
      name: '中秋夜市集',
      nameImage: 'assets/images/market/cards/market-card-09.png',
      date: '2026/10/03 - 2026/10/04',
      location: '台中市西屯區 中央公園',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 10,
      name: '冬日暖光市集',
      nameImage: 'assets/images/market/cards/market-card-10.png',
      date: '2026/11/14 - 2026/11/15',
      location: '台北市大安區 花博公園',
      status: ActivityStatus.draft,
      signupProgress: '-',
      paidCount: '-',
      actionLabel: '查看詳情',
    },
    {
      id: 11,
      name: '春光野餐市集',
      nameImage: 'assets/images/user/activity/history/history-market-01.png',
      date: '2025/04/12 - 2025/04/13',
      location: '台北市大安區 大安森林公園',
      status: ActivityStatus.ended,
      signupProgress: '80 / 80',
      paidCount: '80',
      actionLabel: '查看詳情',
    },
    {
      id: 12,
      name: '手作慢生活市集',
      nameImage: 'assets/images/user/activity/history/history-market-02.png',
      date: '2025/05/18 - 2025/05/19',
      location: '台北市中山區 松山文創園區',
      status: ActivityStatus.ended,
      signupProgress: '96 / 100',
      paidCount: '94',
      actionLabel: '查看詳情',
    },
    {
      id: 13,
      name: '港都藝文市集',
      nameImage: 'assets/images/user/activity/history/history-market-03.png',
      date: '2025/06/07 - 2025/06/08',
      location: '台中市西區 草悟廣場',
      status: ActivityStatus.ended,
      signupProgress: '110 / 120',
      paidCount: '108',
      actionLabel: '查看詳情',
    },
    {
      id: 14,
      name: '高雄風格選物市集',
      nameImage: 'assets/images/user/activity/history/history-market-04.png',
      date: '2025/07/12 - 2025/07/13',
      location: '高雄市鹽埕區 駁二藝術特區',
      status: ActivityStatus.ended,
      signupProgress: '88 / 90',
      paidCount: '88',
      actionLabel: '查看詳情',
    },
  ];

  /** 目前頁面要顯示的活動資料 */
  displayRows: OrganizerEventRow[] = [];

  ngOnInit(): void {
    this.updateDisplayRows();
  }

  get totalItems(): number {
    return this.rows.length;
  }

  /** 切換頁碼後更新表格資料 */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.updateDisplayRows();
  }

  /** 選取狀態篩選後重設到第一頁 */
  selectStatus(status: string): void {
    this.selectedStatus = status === ActivityStatus.all ? '' : status;
    this.currentPage = 1;
    this.updateDisplayRows();
  }

  /** 表格操作按鈕點擊事件 */
  onTableAction(action: DashboardTableAction): void {
    console.log('organizer event action', action);
  }

  /** 依目前頁碼切出表格顯示資料 */
  private updateDisplayRows(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    this.displayRows = this.rows.slice(startIndex, startIndex + this.pageSize);
  }
}
