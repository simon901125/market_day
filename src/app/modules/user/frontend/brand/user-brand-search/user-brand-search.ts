import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrandItem } from '../../../../../models/BrandItem';
import { UserDropdown } from '../../shared/user-dropdown/user-dropdown';
import { Pagination } from '../../../../shared/pagination/pagination';
import { BrandType } from '../../../../../models/type/BrandType ';
import { UserBrandSearchCard } from '../user-brand-search-card/user-brand-search-card';

@Component({
  selector: 'app-user-brandserch',
  imports: [UserBrandSearchCard, UserDropdown, Pagination],
  templateUrl: './user-brand-search.html',
  styleUrl: './user-brand-search.scss',
})
export class UserBrandSearch {
  /** 品牌類型下拉選單 */
  brandTypeOptions = BrandType.filterList;

  /** 參與市集下拉選單 */
  marketOptions = ['全部市集', '草悟野餐市集', '咖啡生活節', '夏日風格服裝市集'];

  /** 目前頁碼 */
  currentPage = 1;

  /** 每頁顯示筆數 */
  pageSize = 6;

  constructor(private router: Router) {}

  /** 依目前頁碼取得要顯示的品牌資料 */
  get pagedBrands(): BrandItem[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.brands.slice(start, start + this.pageSize);
  }

  /** 接收分頁元件傳回的頁碼 */
  onPageChange(page: number): void {
    this.currentPage = page;
  }

  /** 前往品牌詳細頁 */
  goToBrandDetail(brand: BrandItem): void {
    this.router.navigate(['/user/brand-detail'], {
      state: { brand },
    });
  }

  /** 品牌列表假資料 */
  brands: BrandItem[] = [
    {
      name: '品一好食主意',
      description: '精選手工點心，從台灣在地食材出發，用心製作每一口。',
      tags: [BrandType.food],
      historyMarkets: ['草悟野餐市集', '咖啡生活節'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '手工甜塔、布丁',
    },
    {
      name: '鑲 · 手作飾品',
      description: '以金屬工藝融合自然元素，打造獨一無二的手作飾品。',
      tags: [BrandType.handmade],
      historyMarkets: ['夏日風格服裝市集'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '耳環、項鍊',
    },
    {
      name: '革本皮件',
      description: '職人手縫皮件，每一針每一線都是對質感的堅持。',
      tags: [BrandType.fashion],
      historyMarkets: ['草悟野餐市集'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '長夾、名片夾',
    },
    {
      name: '紙上植物',
      description: '將自然植物轉化為文創設計，讓日常充滿生命力。',
      tags: [BrandType.plant],
      historyMarkets: ['咖啡生活節'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '植物明信片、書籤',
    },
    {
      name: '簡生活選物',
      description: '精選溫柔質感生活雜貨，讓居家日常多一點細緻溫度。',
      tags: [BrandType.handmade],
      historyMarkets: ['草悟野餐市集', '夏日風格服裝市集'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '香氛蠟燭、馬克杯',
    },
    {
      name: '默默設計',
      description: '用設計說故事，讓每件作品都有一段值得珍藏的記憶。',
      tags: [BrandType.handmade],
      historyMarkets: ['咖啡生活節', '夏日風格服裝市集'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '品牌周邊、印刷品',
    },
    {
      name: '毛日子寵物選品',
      description: '為毛孩挑選安心實用的日常用品，陪伴每個溫暖生活片刻。',
      tags: [BrandType.pet],
      historyMarkets: ['草悟野餐市集'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '寵物圍巾、零食包',
    },
    {
      name: '小島玩具研究所',
      description: '設計親子共享的木作玩具，讓孩子在遊戲裡探索與學習。',
      tags: [BrandType.toy],
      historyMarkets: ['夏日風格服裝市集'],
      image: 'assets/images/user/user-brandserch-PromotionalPhotos_1.png',
      logo: 'assets/images/user/user-brandserch-brandLogo.png',
      goodat_works: '木作玩具、益智積木',
    },
  ];
}