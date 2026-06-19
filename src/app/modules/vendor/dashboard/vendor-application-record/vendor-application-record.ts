import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardPagination } from '../../../shared/dashboard-pagination/dashboard-pagination';

interface RecordTab {
  label: string;
  value: ApplicationRecordStatus | 'all';
}

type ApplicationRecordStatus =
  | 'reviewing'
  | 'payment'
  | 'booth'
  | 'completed'
  | 'refundApplying'
  | 'refundProcessing'
  | 'refunded'
  | 'history';

interface RecordAction {
  label: string;
  style: 'primary' | 'outline';
}

interface ApplicationRecord {
  id: number;
  image: string;
  marketName: string;
  eventDate: string;
  location: string;
  applicationNo: string;
  status: ApplicationRecordStatus;
  statusText: string;
  statusClass: string;
  actions: RecordAction[];
}

@Component({
  selector: 'app-vendor-application-record',
  imports: [CommonModule, DashboardPagination],
  templateUrl: './vendor-application-record.html',
  styleUrl: './vendor-application-record.scss',
})
export class VendorApplicationRecord {
  /** 目前選取的報名狀態分頁，預設顯示全部紀錄。 */
  activeTab: RecordTab['value'] = 'all';

  /** 目前頁碼，會傳給共用 app-dashboard-pagination。 */
  currentPage = 1;

  /** 每頁顯示筆數，依設計稿頁尾顯示 1 - 8 筆設定。 */
  pageSize = 8;

  /** 報名狀態分頁資料，之後可依 API 狀態欄位調整 value。 */
  tabs: RecordTab[] = [
    { label: '全部', value: 'all' },
    { label: '待審核', value: 'reviewing' },
    { label: '待付款', value: 'payment' },
    { label: '待選位', value: 'booth' },
    { label: '報名完成', value: 'completed' },
    { label: '退款申請中', value: 'refundApplying' },
    { label: '退款處理中', value: 'refundProcessing' },
    { label: '已退款', value: 'refunded' },
    { label: '歷史紀錄', value: 'history' },
  ];

  /** 報名紀錄先以假資料呈現，串接後端時可替換為 API 回傳資料。 */
  records: ApplicationRecord[] = [
    {
      id: 1,
      image: 'assets/images/market/cards/market-card-01.png',
      marketName: '新動市集・貓貓森林市',
      eventDate: '2024/06/15 - 2024/06/16',
      location: '新北市板橋區 新板特區公園',
      applicationNo: 'MD202406150001',
      status: 'refundApplying',
      statusText: '退款申請中',
      statusClass: 'refund-applying',
      actions: [
        { label: '前往收款管理', style: 'primary' },
        { label: '查看', style: 'outline' },
      ],
    },
    {
      id: 2,
      image: 'assets/images/market/cards/market-card-02.png',
      marketName: '春日手作生活節',
      eventDate: '2024/06/22 - 2024/06/23',
      location: '台中市西區 草悟道廣場',
      applicationNo: 'MD202406220032',
      status: 'refundProcessing',
      statusText: '退款處理中',
      statusClass: 'refund-processing',
      actions: [{ label: '查看', style: 'outline' }],
    },
    {
      id: 3,
      image: 'assets/images/market/cards/market-card-03.png',
      marketName: '海風手作市集',
      eventDate: '2024/05/04 - 2024/05/05',
      location: '高雄市新津區 旗津貝殼館廣場',
      applicationNo: 'MD202405040018',
      status: 'refunded',
      statusText: '已退款',
      statusClass: 'refunded',
      actions: [{ label: '查看', style: 'outline' }],
    },
    {
      id: 4,
      image: 'assets/images/market/cards/market-card-04.png',
      marketName: '植感生活市集',
      eventDate: '2024/06/15 - 2024/06/16',
      location: '台南市新營區 長勝營區市地',
      applicationNo: 'MD202406150045',
      status: 'completed',
      statusText: '報名完成',
      statusClass: 'completed',
      actions: [{ label: '查看', style: 'outline' }],
    },
    {
      id: 5,
      image: 'assets/images/market/cards/market-card-05.png',
      marketName: '小森散步市集',
      eventDate: '2024/05/01 - 2024/05/02',
      location: '桃園市八德區 八德埤塘・生態公園',
      applicationNo: 'MD202405010009',
      status: 'booth',
      statusText: '待選位',
      statusClass: 'booth',
      actions: [
        { label: '選擇攤位', style: 'primary' },
        { label: '退款', style: 'primary' },
        { label: '查看', style: 'outline' },
      ],
    },
    {
      id: 6,
      image: 'assets/images/market/cards/market-card-06.png',
      marketName: '甜點微光市集',
      eventDate: '2024/07/06 - 2024/07/07',
      location: '台北市中正區 華山文創園區',
      applicationNo: 'MD202407060011',
      status: 'payment',
      statusText: '待付款',
      statusClass: 'payment',
      actions: [
        { label: '付款', style: 'primary' },
        { label: '查看', style: 'outline' },
      ],
    },
    {
      id: 7,
      image: 'assets/images/market/cards/market-card-07.png',
      marketName: '城市選物市集',
      eventDate: '2024/07/13 - 2024/07/14',
      location: '新竹市東區 關新公園',
      applicationNo: 'MD202407130020',
      status: 'reviewing',
      statusText: '待審核',
      statusClass: 'reviewing',
      actions: [
        { label: '審核', style: 'primary' },
        { label: '查看', style: 'outline' },
      ],
    },
    {
      id: 8,
      image: 'assets/images/market/cards/market-card-08.png',
      marketName: '慢生活週末市集',
      eventDate: '2024/04/20 - 2024/04/21',
      location: '嘉義市東區 森林之歌廣場',
      applicationNo: 'MD202404200027',
      status: 'history',
      statusText: '已取消',
      statusClass: 'history',
      actions: [{ label: '查看', style: 'outline' }],
    },
    {
      id: 9,
      image: 'assets/images/market/cards/market-card-09.png',
      marketName: '花園午茶市集',
      eventDate: '2024/07/20 - 2024/07/21',
      location: '台北市信義區 香堤大道廣場',
      applicationNo: 'MD202407200016',
      status: 'completed',
      statusText: '報名完成',
      statusClass: 'completed',
      actions: [{ label: '查看', style: 'outline' }],
    },
    {
      id: 10,
      image: 'assets/images/market/cards/market-card-10.png',
      marketName: '夏夜文創市集',
      eventDate: '2024/08/03 - 2024/08/04',
      location: '高雄市鹽埕區 駁二藝術特區',
      applicationNo: 'MD202408030008',
      status: 'booth',
      statusText: '待選位',
      statusClass: 'booth',
      actions: [
        { label: '選擇攤位', style: 'primary' },
        { label: '退款', style: 'primary' },
        { label: '查看', style: 'outline' },
      ],
    },
  ];

  /** 依目前分頁篩選後的紀錄。 */
  get filteredRecords(): ApplicationRecord[] {
    if (this.activeTab === 'all') {
      return this.records;
    }

    return this.records.filter((record) => record.status === this.activeTab);
  }

  /** 目前頁面要顯示的紀錄資料。 */
  get pagedRecords(): ApplicationRecord[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.filteredRecords.slice(startIndex, startIndex + this.pageSize);
  }

  /** 切換狀態分頁時回到第一頁。 */
  setActiveTab(tab: RecordTab['value']): void {
    this.activeTab = tab;
    this.currentPage = 1;
  }

  /** 接收共用分頁元件送出的頁碼。 */
  setPage(page: number): void {
    this.currentPage = page;
  }
}
