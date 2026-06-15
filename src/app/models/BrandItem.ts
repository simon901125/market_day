export interface BrandProduct {
  image: string;
  name: string;
  price: number;
  description: string;
}

export interface BrandMarketRecord {
  name: string;
  year: string;
  startDate: string;
  endDate: string;
}

export interface BrandLinks {
  instagram: string;
  facebook: string;
  officialWebsite: string;
}

/** 攤位品牌資料 */
export interface BrandItem {
  /** 品牌識別碼 */
  id: string;
  /** 攤位名字 */
  name: string;
  /** 攤位描述 */
  description: string;
  /** 品牌完整介紹 */
  introduction: string;
  /** 攤位標籤 */
  tags: string[];
  /** 過去活動紀錄 */
  historyMarkets: BrandMarketRecord[];
  /** 圖片 */
  image: string;
  /** logo */
  logo: string;
  /** 代表商品 */
  goodat_works: string;
  /** 品牌代表作品 */
  products: BrandProduct[];
  /** 品牌社群與網站 */
  links: BrandLinks;
}
