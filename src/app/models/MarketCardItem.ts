/** 市集卡片項目 */
export interface MarketCardItem {
  /** 市集標題 */
  title: string;
  /** 市集時間 */
  time: string;
  /** 市集日期 */
  date: string;
  /** 市集描述 */
  description: string;
  /** 市集地點 */
  location: string;
  /** 市集圖片 */
  image: string; 
  /** 市集狀態 */
  status: string;
  /** 市集狀態對應的 CSS 類別 */
  statusClass: string;
  /** 市集標籤 */
  tags: string[];
  //Address: string;
  //brandImg: string;
  //Transportation: string[];

}

//dateEnd
//dateStart
