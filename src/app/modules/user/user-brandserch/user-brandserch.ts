import { Component, HostListener } from '@angular/core';
import { BrandItem } from '../../../models/BrandItem';
import { UserBrandserchCard } from '../user-brandserch-card/user-brandserch-card';
import { UserBrandserchTag } from '../user-brandserch-tag/user-brandserch-tag';
import { UserBrandserchDropdown } from '../user-brandserch-dropdown/user-brandserch-dropdown';

@Component({
  selector: 'app-user-brandserch',
  imports: [UserBrandserchCard, UserBrandserchTag, UserBrandserchDropdown],
  templateUrl: './user-brandserch.html',
  styleUrl: './user-brandserch.scss',
})
export class UserBrandserch {
  brandTypeOptions = ['全部市集', '餐飲美食', '文創手作', '親子家庭', '寵物生活', '植物選物', '服飾配件', '玩具選物'];
  marketOptions: string[] = [];
  isBrandTypeOpen = false;
  isMarketOpen = false;
  selectedBrandType = '品牌類型';
  selectedMarket = '參與市集';

  toggleBrandType(): void {
    this.isBrandTypeOpen = !this.isBrandTypeOpen;
    this.isMarketOpen = false;
  }

  toggleMarket(): void {
    this.isMarketOpen = !this.isMarketOpen;
    this.isBrandTypeOpen = false;
  }

  onBrandTypeSelected(value: string): void {
    this.selectedBrandType = value;
    this.isBrandTypeOpen = false;
  }

  onMarketSelected(value: string): void {
    this.selectedMarket = value;
    this.isMarketOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!(event.target as HTMLElement).closest('.select-wrapper')) {
      this.isBrandTypeOpen = false;
      this.isMarketOpen = false;
    }
  }
  tags = ['全部類型', '手作飾品', '手工皮件', '文創設計', '生活雜貨', '美食甜點'];
  activeTagIndex = 0;

  selectTag(index: number): void {
    this.activeTagIndex = index;
  }

  brands: BrandItem[] = [
    {
      name: '品一好食主意',
      description: '精選手工點心，從台灣在地食材出發，用心製作每一口。',
      tags: ['餐飲美食'],
      historyMarkets: ['草悟野餐市集', '咖啡生活節'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: '',
      goodat_works: '手工甜塔、布丁',
      masterpiece: '限定甜塔系列',
    },
    {
      name: '鑲 · 手作飾品',
      description: '以金屬工藝融合自然元素，打造獨一無二的手作飾品。',
      tags: ['文創手作'],
      historyMarkets: ['夏日風格服裝市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: '',
      goodat_works: '耳環、項鍊',
      masterpiece: '月光石系列耳環',
    },
    {
      name: '革本皮件',
      description: '職人手縫皮件，每一針每一線都是對質感的堅持。',
      tags: ['服飾配件'],
      historyMarkets: ['草悟野餐市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: '',
      goodat_works: '長夾、名片夾',
      masterpiece: '植鞣革長夾',
    },
    {
      name: '紙上植物',
      description: '將自然植物轉化為文創設計，讓日常充滿生命力。',
      tags: ['文創設計'],
      historyMarkets: ['咖啡生活節'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: '',
      goodat_works: '植物明信片、書籤',
      masterpiece: '四季植物明信片組',
    },
    {
      name: '簡生活選物',
      description: '精選北歐風格生活雜貨，讓家更有溫度。',
      tags: ['文創手作'],
      historyMarkets: ['草悟野餐市集', '夏日風格服裝市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: '',
      goodat_works: '香氛蠟燭、馬克杯',
      masterpiece: '手工香氛蠟燭禮盒',
    },
    {
      name: '默默設計',
      description: '用設計說故事，讓每件作品都有一段值得珍藏的記憶。',
      tags: ['文創手作'],
      historyMarkets: ['咖啡生活節', '夏日風格服裝市集'],
      image: 'assets/images/PromotionalPhotos_1.png',
      logo: '',
      goodat_works: '品牌周邊、印刷品',
      masterpiece: '城市插畫徽章組',
    },
  ];
}
