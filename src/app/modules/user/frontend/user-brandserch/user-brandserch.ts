import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BrandItem } from '../../../../models/BrandItem';
import { UserBrandserchCard } from '../user-brandserch-card/user-brandserch-card';
import { UserBrandserchDropdown } from '../user-brandserch-dropdown/user-brandserch-dropdown';
import { UserBrandserchPagination } from '../user-brandserch-pagination/user-brandserch-pagination';

@Component({
  selector: 'app-user-brandserch',
  imports: [UserBrandserchCard, UserBrandserchDropdown, UserBrandserchPagination],
  templateUrl: './user-brandserch.html',
  styleUrl: './user-brandserch.scss',
})
export class UserBrandserch {
  brandTypeOptions = ['全部市集', '餐飲美食', '文創手作', '親子家庭', '寵物生活', '植物選物', '服飾配件', '玩具選物'];
  marketOptions = ['草悟野餐市集', '咖啡生活節', '夏日風格服裝市集'];

  tags = ['全部類型', '手作飾品', '手工皮件', '文創設計', '生活雜貨', '美食甜點'];
  activeTagIndex = 0;

  constructor(private router: Router) {}

  selectTag(index: number): void {
    this.activeTagIndex = index;
  }

  /** 接收頁碼元件的頁碼變更事件 */
  onPageChange(page: number): void {
    // TODO: 根據頁碼向 API 請求對應資料
    console.log('切換至第', page, '頁');
  }

  goToBrandDetail(brand: BrandItem): void {
    this.router.navigate(['/user/brand-detail'], {
      state: { brand: brand },
    });
  }

  brands: BrandItem[] = [
    {
      name: '品一好食主意',
      description: '精選手工點心，從台灣在地食材出發，用心製作每一口。',
      tags: ['餐飲美食'],
      historyMarkets: ['草悟野餐市集', '咖啡生活節'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: 'assets/images/brandLogo.png',
      goodat_works: '手工甜塔、布丁',
    },
    {
      name: '鑲 · 手作飾品',
      description: '以金屬工藝融合自然元素，打造獨一無二的手作飾品。',
      tags: ['文創手作'],
      historyMarkets: ['夏日風格服裝市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: 'assets/images/brandLogo.png',
      goodat_works: '耳環、項鍊',
    },
    {
      name: '革本皮件',
      description: '職人手縫皮件，每一針每一線都是對質感的堅持。',
      tags: ['服飾配件'],
      historyMarkets: ['草悟野餐市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: 'assets/images/brandLogo.png',
      goodat_works: '長夾、名片夾',
    },
    {
      name: '紙上植物',
      description: '將自然植物轉化為文創設計，讓日常充滿生命力。',
      tags: ['文創設計'],
      historyMarkets: ['咖啡生活節'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: 'assets/images/brandLogo.png',
      goodat_works: '植物明信片、書籤',
    },
    {
      name: '簡生活選物',
      description: '精選北歐風格生活雜貨，讓家更有溫度。',
      tags: ['文創手作'],
      historyMarkets: ['草悟野餐市集', '夏日風格服裝市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: 'assets/images/brandLogo.png',
      goodat_works: '香氛蠟燭、馬克杯',
    },
    {
      name: '默默設計',
      description: '用設計說故事，讓每件作品都有一段值得珍藏的記憶。',
      tags: ['文創手作'],
      historyMarkets: ['咖啡生活節', '夏日風格服裝市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: 'assets/images/brandLogo.png',
      goodat_works: '品牌周邊、印刷品',
    },
  ];
}
