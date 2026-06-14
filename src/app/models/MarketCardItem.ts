import { MarketSlot } from "./MarketSlot";

/** 市集卡片項目 */
export interface MarketCardItem {
  /** 市集標題 */
  title: string;
  /** 市集時間 */
  time: string;
  /** 市集開始日期 */
  start_date: string;
  /** 市集結束日期 */
  end_date: string;
  /** 市集描述 */
  description: string;
  /** 市集地點 */
  location: string;
  /** 市集地址 */
  address: string;
  /** 市集城市 */
  city: string;
  /** 市集區域 */
  area: string;
  /** 市集圖片 */
  image: string; 
  /** 市集狀態 */
  status: string;
  /** 市集狀態對應的 CSS 類別 */
  statusClass: string;
  /** 市集標籤 */
  tags: string[];
  /** 市集類別 */
  category: string;
  /** 市集主辦單位 */
  organizer: string;
  /** 市集交通資訊 */
  transportation: string[];
  /** 公開攤位日期 */
  infoDate?: string; 
  /** 各場次剩餘攤位 */
  slots?: MarketSlot[];
  price?: number;

}

//dateEnd
//dateStart
