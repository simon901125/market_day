/** 攤位類別 */
export interface CategoryItem {
  /** 類別名稱 */
  name: string;
  /** 圖示 */
  icon: string;
  /** 是否為活動類別 */
  active?: boolean;
}