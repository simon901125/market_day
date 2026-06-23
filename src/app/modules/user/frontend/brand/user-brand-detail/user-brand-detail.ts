import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandItem } from '../../../../../models/interface/shared/BrandItem';
import { BRANDS, findBrandById } from '../user-brand-search/user-brand-search';

@Component({
  selector: 'app-user-brand-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-brand-detail.html',
  styleUrl: './user-brand-detail.scss',
})
/** 品牌詳情頁，依 query param 或導頁 state 還原品牌資料。 */
export class UserBrandDetail {
  /** 目前顯示的品牌資料；沒有指定品牌時顯示第一筆預設資料。 */
  brand: BrandItem = BRANDS[0];

  /** 優先使用導頁 state，其次用 query param，最後回到預設品牌。 */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const navigation = this.router.currentNavigation();
    const stateBrand =
      navigation?.extras.state?.['brand'] ??
      (history.state?.brand as BrandItem | undefined);
    const brandId = this.route.snapshot.queryParamMap.get('brand') ?? stateBrand?.id;

    this.brand = findBrandById(brandId) ?? stateBrand ?? BRANDS[0];
  }

  /** 品牌曾參與過的市集紀錄。 */
  get marketRecords() {
    return this.brand.historyMarkets;
  }

  /** 從社群網址取出帳號名稱，讓畫面顯示更簡潔。 */
  getSocialAccount(url: string): string {
    try {
      const account = new URL(url).pathname.split('/').filter(Boolean)[0];
      return account ? `@${account}` : '@marketday.brand';
    } catch {
      return '@marketday.brand';
    }
  }

  /** 從官網網址取出網域名稱。 */
  getWebsiteHost(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return 'brand.marketday.tw';
    }
  }
}
