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
    image: brandImage('brand-03', 'cover.png'),
    logo: brandImage('brand-03', 'logo.png'),
    goodat_works: '觀葉植物、盆器、養護小卡',
    products: [
      { image: brandImage('brand-03', 'product-01.png'), name: '桌上小盆栽', price: 520, description: '適合書桌與窗邊的小型觀葉植物。' },
      { image: brandImage('brand-03', 'product-02.png'), name: '手作陶盆', price: 880, description: '低調釉色，適合多種植栽搭配。' },
      { image: brandImage('brand-03', 'product-03.png'), name: '新手養護組', price: 620, description: '包含工具、說明卡與基礎肥料。' },
    ],
    links: { instagram: 'https://instagram.com/morigreen.lab', facebook: 'https://facebook.com/morigreen.lab', officialWebsite: 'https://morigreen.example.com' },
  },
  {
    id: 'brand-04',
    name: '暖木工房',
    description: '以木作小物與生活收納為主，保留木紋的溫潤質感。',
    introduction:
      '暖木工房使用天然木料製作杯墊、托盤與桌上收納，讓日常物件在手感與實用之間取得平衡。每件作品都保留木紋差異，適合喜歡自然質地的人。',
    tags: [BrandType.handmade],
    historyMarkets: [
      { name: '城市手作週末', year: '2025', startDate: '08/10', endDate: '08/11' },
      { name: '風格選物生活節', year: '2025', startDate: '09/13', endDate: '09/14' },
    ],
    image: brandImage('brand-04', 'cover.png'),
    logo: brandImage('brand-04', 'logo.png'),
    goodat_works: '木作杯墊、托盤、桌上收納',
    products: [
      { image: brandImage('brand-04', 'product-01.png'), name: '山形杯墊組', price: 360, description: '以不同木色拼接，適合日常茶飲與咖啡時光。' },
      { image: brandImage('brand-04', 'product-02.png'), name: '木質小托盤', price: 760, description: '可放飾品、鑰匙或點心，保留自然木紋。' },
      { image: brandImage('brand-04', 'product-03.png'), name: '桌上收納盒', price: 890, description: '簡潔分格設計，整理文具與小物剛剛好。' },
    ],
    links: { instagram: 'https://instagram.com/warmwood.studio', facebook: 'https://facebook.com/warmwood.studio', officialWebsite: 'https://warmwood.example.com' },
  },
  {
    id: 'brand-05',
    name: '毛日子選物',
    description: '為毛孩挑選日常用品與散步配件，風格柔和又實用。',
    introduction:
      '毛日子選物關注寵物與飼主的共同生活，挑選輕量牽繩、外出小包與寵物玩具，讓散步、旅行與日常陪伴都更舒服。',
    tags: [BrandType.pet],
    historyMarkets: [
      { name: '毛孩友善市集', year: '2025', startDate: '05/18', endDate: '05/19' },
      { name: '週末生活市集', year: '2025', startDate: '10/04', endDate: '10/05' },
    ],
    image: brandImage('brand-05', 'cover.png'),
    logo: brandImage('brand-05', 'logo.png'),
    goodat_works: '寵物牽繩、外出包、玩具選物',
    products: [
      { image: brandImage('brand-05', 'product-01.png'), name: '輕量散步牽繩', price: 490, description: '柔軟織帶搭配穩固扣具，適合每日散步。' },
      { image: brandImage('brand-05', 'product-02.png'), name: '寵物外出小包', price: 680, description: '可收納零食、濕紙巾與小型用品。' },
      { image: brandImage('brand-05', 'product-03.png'), name: '啃咬玩具組', price: 320, description: '柔和配色與耐咬材質，陪毛孩消耗精力。' },
    ],
    links: { instagram: 'https://instagram.com/petdays.select', facebook: 'https://facebook.com/petdays.select', officialWebsite: 'https://petdays.example.com' },
  },
  {
    id: 'brand-06',
    name: '日常銀飾',
    description: '製作簡約銀飾與天然石配件，適合每天配戴。',
    introduction:
      '日常銀飾以細緻線條與低調光澤為特色，作品包含戒指、耳環與項鍊，也提供簡單保養建議，讓飾品能長久陪伴日常。',
    tags: [BrandType.fashion],
    historyMarkets: [
      { name: '風格選物生活節', year: '2025', startDate: '09/13', endDate: '09/14' },
      { name: '秋日風格市集', year: '2025', startDate: '11/08', endDate: '11/09' },
    ],
    image: brandImage('brand-06', 'cover.png'),
    logo: brandImage('brand-06', 'logo.png'),
    goodat_works: '銀戒、耳環、天然石項鍊',
    products: [
      { image: brandImage('brand-06', 'product-01.png'), name: '細線銀戒', price: 580, description: '簡約線條，可單戴也能疊戴。' },
      { image: brandImage('brand-06', 'product-02.png'), name: '月光石耳環', price: 760, description: '天然石微光搭配銀色耳勾，溫柔耐看。' },
      { image: brandImage('brand-06', 'product-03.png'), name: '小圓牌項鍊', price: 890, description: '低調亮面處理，適合日常穿搭。' },
    ],
    links: { instagram: 'https://instagram.com/daily.silver', facebook: 'https://facebook.com/daily.silver', officialWebsite: 'https://dailysilver.example.com' },
  },
  {
    id: 'brand-07',
    name: '小步親子',
    description: '設計親子共用的小遊戲與布書，讓陪伴更有節奏。',
    introduction:
      '小步親子以孩子的觀察與觸覺探索為起點，製作布書、圖卡與桌遊小物，讓家長在短短的日常片段中，也能和孩子一起玩出互動。',
    tags: [BrandType.family, BrandType.toy],
    historyMarkets: [
      { name: '親子午後市集', year: '2025', startDate: '04/20', endDate: '04/21' },
      { name: '週末生活市集', year: '2025', startDate: '10/04', endDate: '10/05' },
    ],
    image: brandImage('brand-07', 'cover.png'),
    logo: brandImage('brand-07', 'logo.png'),
    goodat_works: '布書、圖卡、親子桌遊',
    products: [
      { image: brandImage('brand-07', 'product-01.png'), name: '觸感布書', price: 620, description: '不同布料與翻頁設計，適合親子共讀。' },
      { image: brandImage('brand-07', 'product-02.png'), name: '生活觀察圖卡', price: 380, description: '以市集和生活場景設計，陪孩子認識日常。' },
      { image: brandImage('brand-07', 'product-03.png'), name: '迷你配對桌遊', price: 450, description: '簡單規則，適合短時間互動遊戲。' },
    ],
    links: { instagram: 'https://instagram.com/littlesteps.kids', facebook: 'https://facebook.com/littlesteps.kids', officialWebsite: 'https://littlesteps.example.com' },
  },
  {
    id: 'brand-08',
    name: '慢慢香氛',
    description: '以植物香氣與手工蠟燭打造放鬆的居家時刻。',
    introduction:
      '慢慢香氛調配木質、花草與果香氣味，製作手工蠟燭、擴香石與香氛噴霧，希望讓忙碌生活中也能有一段慢下來的時間。',
    tags: [BrandType.handmade],
    historyMarkets: [
      { name: '夜光香氣市集', year: '2025', startDate: '07/19', endDate: '07/20' },
      { name: '秋日風格市集', year: '2025', startDate: '11/08', endDate: '11/09' },
    ],
    image: brandImage('brand-08', 'cover.png'),
    logo: brandImage('brand-08', 'logo.png'),
    goodat_works: '手工蠟燭、擴香石、香氛噴霧',
    products: [
      { image: brandImage('brand-08', 'product-01.png'), name: '木質調蠟燭', price: 520, description: '沉穩木質香氣，適合睡前和閱讀時使用。' },
      { image: brandImage('brand-08', 'product-02.png'), name: '花草擴香石', price: 360, description: '小巧造型，可放在玄關、衣櫃或書桌。' },
      { image: brandImage('brand-08', 'product-03.png'), name: '日常香氛噴霧', price: 420, description: '清爽不厚重，適合空間與布品使用。' },
    ],
    links: { instagram: 'https://instagram.com/slowly.scent', facebook: 'https://facebook.com/slowly.scent', officialWebsite: 'https://slowlyscent.example.com' },
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
  pageSize = 8;
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
