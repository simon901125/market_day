import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface StallField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'select';
  value: string;
  options?: string[];
}

interface UploadGuide {
  text: string;
}

interface StallProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-vendor-dashboard-stall',
  imports: [FormsModule],
  templateUrl: './vendor-dashboard-stall.html',
  styleUrl: './vendor-dashboard-stall.scss',
})
export class VendorDashboardStall {
  /** 基本資料先使用假資料綁定，之後串接 API 時可直接替換欄位 value。 */
  basicFields: StallField[] = [
    { label: '品牌名稱', name: 'brandName', type: 'text', value: '小集日工作室' },
    { label: '負責人姓名', name: 'ownerName', type: 'text', value: '小集日' },
    { label: '聯絡電話', name: 'phone', type: 'text', value: '0975-859-025' },
    { label: 'Email', name: 'email', type: 'email', value: 'littlemarket@gmail.com' },
    {
      label: '縣市',
      name: 'city',
      type: 'select',
      value: '台中市',
      options: ['台北市', '新北市', '台中市', '台南市', '高雄市'],
    },
    { label: 'Instagram', name: 'instagram', type: 'text', value: '@littlemarket_day' },
    {
      label: '區',
      name: 'district',
      type: 'select',
      value: '南屯區',
      options: ['中區', '西區', '南屯區', '北屯區', '西屯區'],
    },
    { label: 'Facebook 粉絲專頁', name: 'facebook', type: 'text', value: '@littlemarket' },
    { label: '詳細地址', name: 'address', type: 'text', value: '公益路二段 537 號' },
    { label: '官方網站', name: 'website', type: 'text', value: 'https://littlemarket.com' },
  ];

  /** 大頭貼上傳規格說明，讓 template 以資料綁定方式渲染。 */
  avatarGuides: UploadGuide[] = [
    { text: '建議尺寸 1:1' },
    { text: '檔案格式：JPG / PNG' },
    { text: '檔案大小：最大 5MB' },
    { text: '可上傳品牌或 LOGO 作為大頭貼' },
  ];

  /** 品牌封面上傳規格說明，之後若規格變更只需調整此陣列。 */
  coverGuides: UploadGuide[] = [
    { text: '建議尺寸 1200 x 600 像素' },
    { text: '檔案格式：JPG / PNG' },
    { text: '檔案大小：最大 5MB' },
    { text: '封面將顯示於你的攤位頁面' },
  ];

  /** 品牌文字資料使用 ngModel 雙向綁定，方便後續整理成送出 payload。 */
  brandInfo = {
    description: '',
    category: '玩具收藏',
    categories: ['玩具收藏', '餐飲美食', '文創手作', '服飾配件', '寵物生活', '植物選物'],
    maxDescriptionLength: 500,
  };

  /** 品牌商品先以假資料呈現，之後可替換為攤主商品 API 回傳。 */
  products: StallProduct[] = [
    {
      name: '小白狗尿尿',
      description: '可愛造型',
      price: 20,
      image: 'assets/images/user/brand/brands/brand-01/product-01.png',
    },
    {
      name: '躺躺',
      description: '很長',
      price: 250,
      image: 'assets/images/user/brand/brands/brand-01/product-02.png',
    },
  ];

  /** 儲存目前表單資料；串接 API 時可在此送出攤位資料。 */
  saveChanges(): void {
    console.log('stall form saved', {
      basicFields: this.basicFields,
      brandInfo: this.brandInfo,
      products: this.products,
    });
  }
}
