import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrandItem } from '../../../../../models/interface/shared/BrandItem';
import { BrandType } from '../../../../../models/type/BrandType ';
import { Pagination } from '../../../../shared/pagination/pagination';
import { Dropdown } from '../../../../shared/dropdown/dropdown';
import { UserBrandSearchCard } from '../user-brand-search-card/user-brand-search-card';

const brandImage = (brandId: string, fileName: string): string =>
  `assets/images/user/brand/brands/${brandId}/${fileName}`;

export const BRANDS: BrandItem[] = [
  {
    id: 'brand-01',
    name: '拾甜甜點',
    description: '以季節水果與手作塔派為主的甜點品牌，擅長把市集日常做得溫柔又好入口。',
    introduction:
      '拾甜甜點相信甜點是日常裡很小、但很必要的療癒。品牌使用當季水果、低甜度奶餡與手工塔皮，製作適合市集分享的甜點盒與常溫點心。',
    tags: [BrandType.food],
    historyMarkets: [
      { name: '春日野餐市集', year: '2025', startDate: '03/27', endDate: '03/30' },
      { name: '夏日綠意市集', year: '2025', startDate: '08/16', endDate: '08/17' },
    ],
    image: brandImage('brand-01', 'cover.png'),
    logo: brandImage('brand-01', 'logo.png'),
    goodat_works: '水果塔、磅蛋糕、手工餅乾',
    products: [
      { image: brandImage('brand-01', 'product-01.png'), name: '季節水果塔', price: 380, description: '以當季水果搭配低甜度卡士達，口感清爽。' },
      { image: brandImage('brand-01', 'product-02.png'), name: '檸檬磅蛋糕', price: 240, description: '帶有檸檬香氣的濕潤磅蛋糕，適合搭配咖啡。' },
      { image: brandImage('brand-01', 'product-03.png'), name: '手工餅乾禮盒', price: 290, description: '多款口味組合，適合送禮或野餐分享。' },
    ],
    links: { instagram: 'https://instagram.com/shitian.sweets', facebook: 'https://facebook.com/shitian.sweets', officialWebsite: 'https://shitian.example.com' },
  },
  {
    id: 'brand-02',
    name: '花間布作',
    description: '以自然色系布料製作包袋與生活小物，作品細緻耐用。',
    introduction:
      '花間布作從日常使用出發，挑選耐磨布料與柔和配色，製作帆布袋、收納包與餐墊等生活用品，希望讓手作物件陪伴更久。',
    tags: [BrandType.handmade],
    historyMarkets: [
      { name: '手感工藝生活節', year: '2025', startDate: '07/02', endDate: '07/05' },
      { name: '風格選物生活節', year: '2025', startDate: '09/13', endDate: '09/14' },
    ],
    image: brandImage('brand-02', 'cover.png'),
    logo: brandImage('brand-02', 'logo.png'),
    goodat_works: '帆布包、收納包、餐墊',
    products: [
      { image: brandImage('brand-02', 'product-01.png'), name: '日常帆布包', price: 420, description: '輕便耐用，適合通勤與市集購物。' },
      { image: brandImage('brand-02', 'product-02.png'), name: '口金收納包', price: 320, description: '小巧容量剛好，可收納零錢與耳機。' },
      { image: brandImage('brand-02', 'product-03.png'), name: '拼布餐墊', price: 680, description: '自然色拼接，讓餐桌多一點溫度。' },
    ],
    links: { instagram: 'https://instagram.com/hanama.textile', facebook: 'https://facebook.com/hanama.textile', officialWebsite: 'https://hanama.example.com' },
  },
  {
    id: 'brand-03',
    name: '森綠植栽',
    description: '提供小型盆栽、植栽搭配與養護建議，讓新手也能輕鬆照顧植物。',
    introduction:
      '森綠植栽專注於適合室內空間的小型植物，搭配手作盆器與簡易養護說明，讓每個人都能從一盆綠意開始整理自己的生活節奏。',
    tags: [BrandType.plant],
    historyMarkets: [
      { name: '植感生活市集', year: '2025', startDate: '06/15', endDate: '06/16' },
      { name: '城市手作週末', year: '2025', startDate: '08/10', endDate: '08/11' },
    ],
    image: brandImage('brand-04', 'cover.png'),
    logo: brandImage('brand-04', 'logo.png'),
    goodat_works: '觀葉植物、盆器、養護小卡',
    products: [
      { image: brandImage('brand-04', 'product-01.png'), name: '桌上小盆栽', price: 520, description: '適合書桌與窗邊的小型觀葉植物。' },
      { image: brandImage('brand-04', 'product-02.png'), name: '手作陶盆', price: 880, description: '低調釉色，適合多種植栽搭配。' },
      { image: brandImage('brand-04', 'product-03.png'), name: '新手養護組', price: 620, description: '包含工具、說明卡與基礎肥料。' },
    ],
    links: { instagram: 'https://instagram.com/morigreen.lab', facebook: 'https://facebook.com/morigreen.lab', officialWebsite: 'https://morigreen.example.com' },
  },
];

export const findBrandById = (brandId: string | null | undefined): BrandItem | undefined =>
  BRANDS.find((brand) => brand.id === brandId);

@Component({
  selector: 'app-user-brandserch',
  imports: [UserBrandSearchCard, Dropdown, Pagination],
  templateUrl: './user-brand-search.html',
  styleUrl: './user-brand-search.scss',
})
/** 品牌探索列表頁，顯示品牌卡片與品牌相關篩選 UI。 */
export class UserBrandSearch {
  /** 品牌類型下拉選項。 */
  brandTypeOptions = BrandType.filterList;
  /** 參與市集下拉選項。 */
  marketOptions = ['全部市集', '春日野餐市集', '夏日綠意市集', '手感工藝生活節'];

  /** 目前頁碼。 */
  currentPage = 1;
  /** 每頁顯示品牌數。 */
  pageSize = 6;
  /** 品牌假資料；之後可替換成 API 回傳資料。 */
  readonly brands = BRANDS;

  constructor(private router: Router) {}

  /** 目前頁碼要顯示的品牌卡片。 */
  get pagedBrands(): BrandItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.brands.slice(start, start + this.pageSize);
  }

  /** 切換品牌列表頁碼。 */
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  /** 前往品牌詳情，帶品牌 id 讓詳情頁重新整理仍可還原。 */
  goToBrandDetail(brand: BrandItem): void {
    this.router.navigate(['/user/brand-detail'], {
      queryParams: { brand: brand.id },
      state: { brand },
    });
  }
}
