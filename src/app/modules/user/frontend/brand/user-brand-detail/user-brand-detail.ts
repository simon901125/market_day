import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BrandItem } from '../../../../../models/interface/BrandItem';
import { BRANDS, findBrandById } from '../user-brand-search/user-brand-search';

@Component({
  selector: 'app-user-brand-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-brand-detail.html',
  styleUrl: './user-brand-detail.scss',
})
export class UserBrandDetail {
  brand: BrandItem = BRANDS[0];

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

  get marketRecords() {
    return this.brand.historyMarkets;
  }

  getSocialAccount(url: string): string {
    try {
      const account = new URL(url).pathname.split('/').filter(Boolean)[0];
      return account ? `@${account}` : '@marketday.brand';
    } catch {
      return '@marketday.brand';
    }
  }

  getWebsiteHost(url: string): string {
    try {
      return new URL(url).hostname.replace(/^www\./, '');
    } catch {
      return 'brand.marketday.tw';
    }
  }
}
