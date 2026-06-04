import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BrandItem } from '../../../models/BrandItem';
import { CommonModule } from '@angular/common';

interface ProductItem {
  image: string;
  name: string;
  price: number;
}

interface MarketRecord {
  name: string;
  dateRange: string;
}

interface CurrentMarket {
  name: string;
  dateRange: string;
  startDate: string;
}

@Component({
  selector: 'app-user-brand-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './user-brand-detail.html',
  styleUrl: './user-brand-detail.scss',
})
export class UserBrandDetail {
  brand: BrandItem | null = null;

  readonly defaultImage = 'assets/images/PromotionalPhotos_2.png';

  mockProducts: ProductItem[] = [
    { image: 'assets/images/PromotionalPhotos_2.png', name: '蜂蜜蛋糕禮盒', price: 380 },
    { image: 'assets/images/PromotionalPhotos_2.png', name: '手工瑪德蓮', price: 240 },
    { image: 'assets/images/PromotionalPhotos_2.png', name: '低糖布丁組', price: 290 },
  ];

  mockMarketRecords: MarketRecord[] = [
    { name: '草悟野餐市集', dateRange: '2025/03/15 ~ 2025/03/16' },
    { name: '咖啡生活節', dateRange: '2025/05/10 ~ 2025/05/11' },
    { name: '夏日風格服裝市集', dateRange: '2025/07/05 ~ 2025/07/06' },
  ];

  mockCurrentMarket: CurrentMarket = {
    name: '草悟野餐市集',
    dateRange: '2025/07/16 ~ 2025/07/18',
    startDate: '2025/07/16',
  };

  mockTags = ['台灣品牌', '純手工', '低糖', '無添加'];

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.brand = navigation?.extras.state?.['brand'] || null;
  }

  getDaysRemaining(startDate: string): number {
    const today = new Date();
    const parts = startDate.split('/');
    const start = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const timeDiff = start.getTime() - today.getTime();
    return Math.max(0, Math.ceil(timeDiff / (1000 * 3600 * 24)));
  }
}
