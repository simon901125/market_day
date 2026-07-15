export interface VendorStallProduct {
  id?: number;
  productName: string;
  productPrice: number;
  productSummary: string;
  productImageUrl: string | null;
}

/** 攤主後台攤位資料，欄位名稱與 StallController 回傳內容一致。 */
export interface VendorStallInfo {
  brandName: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  city: string;
  district: string;
  address: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  websiteUrl: string | null;
  avatarImageUrl: string | null;
  coverImageUrl: string | null;
  brandSummary: string;
  brandDescription: string;
  brandType: string;
  products: VendorStallProduct[];
}

export type VendorStallSaveRequest = VendorStallInfo;
