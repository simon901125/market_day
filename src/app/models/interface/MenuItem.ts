/**側邊欄目錄 */
export interface MenuItem {
  /** 標題 */
  label: string;
  /** icon */
  icon: string;
  /** 路徑 */
  path: string;
  /** 訊息數 */
  badge?: number;
}