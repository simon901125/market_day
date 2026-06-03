/** 歷史市集卡片項目 */
export interface HistoryMarketCardItem {
  /** 市集標題 */
  title: string;
  /** 市集開始日期 */
  start_date: string;
  /** 市集結束日期 */
  end_date: string;
  /** 市集地點 */
  location: string;
  /** 市集圖片 */
  image: string;
  /** 市集狀態 */
  status: string;
  /** 市集狀態類別 */
  statusClass: string;
  /** 市集標籤 */
  tags: string[];
  /** 市集類別 */
  category: string;
  /** 市集城市 */
  city: string;
  /** 市集區域 */
  area: string;
  /** 市集描述 */
  desc: string;
}