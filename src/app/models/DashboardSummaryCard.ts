/**
 * 首頁儀表板摘要卡片
 * 例如：待審核報名、待確認付款、即將開始活動
 */
export interface DashboardSummaryCard {
  /** 卡片標題 */
  title: string;
  /** 數量 */
  count: number;
  /** 單位（筆、場、人...） */
  unit: string;
  /** Bootstrap Icon 名稱 */
  icon: string;
  /** 圖示額外樣式 class */
  iconClass?: string;
  /** 點擊後導向頁面 */
  link: string;
}