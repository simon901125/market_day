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
      name: '拾甜製菓',
      description: '選用在地蜂蜜與當季食材，烘焙溫柔耐吃的日常甜點。',
      tags: [BrandType.food],
      historyMarkets: ['草悟野餐市集', '咖啡生活節'],
      image: 'assets/images/user/brand/cards/brand-01-image.png',
      logo: 'assets/images/user/brand/cards/brand-01-logo-v3.png',
      goodat_works: '蜂蜜蛋糕、手工瑪德蓮',
    },
    {
      name: '花間織所',
      description: '以花草為靈感，將細緻針線織進每一件日常布作。',
      tags: [BrandType.handmade],
      historyMarkets: ['夏日風格服裝市集'],
      image: 'assets/images/user/brand/cards/brand-02-image.png',
      logo: 'assets/images/user/brand/cards/brand-02-logo-v3.png',
      goodat_works: '刺繡小包、手作布品',
    },
    {
      name: '青衫製所',
      description: '以天然布料與簡約剪裁，製作舒適耐穿的日常服飾。',
      tags: [BrandType.fashion],
      historyMarkets: ['草悟野餐市集'],
      image: 'assets/images/user/brand/cards/brand-03-image.png',
      logo: 'assets/images/user/brand/cards/brand-03-logo-v3.png',
      goodat_works: '亞麻襯衫、帆布提袋',
    },
    {
      name: '森芽植研',
      description: '用綠意療癒生活，打造適合城市日常的小型植物風景。',
      tags: [BrandType.plant],
      historyMarkets: ['咖啡生活節'],
      image: 'assets/images/user/brand/cards/brand-04-image.png',
      logo: 'assets/images/user/brand/cards/brand-04-logo-v3.png',
      goodat_works: '多肉植栽、玻璃苔景',
    },
    {
      name: '拾土器作',
      description: '揉捏土與釉色的自然變化，留下每件器物獨有的手感。',
      tags: [BrandType.handmade],
      historyMarkets: ['草悟野餐市集', '夏日風格服裝市集'],
      image: 'assets/images/user/brand/cards/brand-05-image.png',
      logo: 'assets/images/user/brand/cards/brand-05-logo-v3.png',
      goodat_works: '手作陶杯、生活器皿',
    },
    {
      name: '暮光香室',
      description: '以植物氣味與柔和燭光，收藏日常裡安靜放鬆的片刻。',
      tags: [BrandType.handmade],
      historyMarkets: ['咖啡生活節', '夏日風格服裝市集'],
      image: 'assets/images/user/brand/cards/brand-06-image.png',
      logo: 'assets/images/user/brand/cards/brand-06-logo-v3.png',
      goodat_works: '香氛蠟燭、植萃噴霧',
    },
    {
      name: '毛日和',
      description: '為毛孩設計舒適又可愛的配件，陪伴每個自在出遊的日子。',
      tags: [BrandType.pet],
      historyMarkets: ['草悟野餐市集'],
      image: 'assets/images/user/brand/cards/brand-07-image.png',
      logo: 'assets/images/user/brand/cards/brand-07-logo-v3.png',
      goodat_works: '寵物領巾、編織牽繩',
    },
    {
      name: '小木日常',
      description: '以溫潤木材製作開放式玩具，陪孩子自由組合與想像。',
      tags: [BrandType.toy],
      historyMarkets: ['夏日風格服裝市集'],
      image: 'assets/images/user/brand/cards/brand-08-image.png',
      logo: 'assets/images/user/brand/cards/brand-08-logo-v3.png',
      goodat_works: '木製積木、手作陀螺',
    },
  ];
}
