import { Component } from '@angular/core';
import { CategoryItem } from '../../../models/CategoryItem';

@Component({
  selector: 'app-user-market-search-panel',
  imports: [],
  templateUrl: './user-market-search-panel.html',
  styleUrl: './user-market-search-panel.scss',
})

export class UserMarketSearchPanel {
  /** 攤位類別 */
  categories: CategoryItem[] = [
    { name: '全部市集', icon: 'bi bi-shop-window', active: true },
    { name: '餐飲美食', icon: 'bi bi-fork-knife' },
    { name: '文創手作', icon: 'bi bi-bag' },
    { name: '親子家庭', icon: 'bi bi-people' },
    { name: '寵物生活', icon: 'bi bi-house-heart' },
    { name: '植物選物', icon: 'bi bi-flower1' },
    { name: '服飾配件', icon: 'bi bi-person-standing-dress' },
    { name: '玩具選物', icon: 'bi bi-gift' },
  ];

  selectCategory(index: number): void {
    this.categories = this.categories.map((category, i) => ({
      ...category,
      active: i === index,
    }));
  }
}