/** 攤位品牌資料 */
export interface BrandItem {
  /** 攤位名字 */
  name: string;
  /** 攤位描述 */
  description: string;
  /** 攤位標籤 */
  tags: string[];
  /** 過去活動紀錄 */
  historyMarkets: string[];
  /** 圖片 */
  image: string;
  /** logo */
  logo: string;
  /** 代表商品 */
  goodat_works: string;
}
