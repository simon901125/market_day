import { Component } from '@angular/core';
import { CategoryItem } from '../../../models/CategoryItem';

@Component({
  selector: 'app-user-market-search-panel',
  imports: [],
  templateUrl: './user-market-search-panel.html',
  styleUrl: './user-market-search-panel.scss',
})

export class UserMarketSearchPanel {
  categories: CategoryItem[] = [
    { name: '全部市集', icon: 'assets/icons/tent-category.svg', active: true },
    { name: '餐飲美食', icon: 'assets/icons/food-category.svg' },
    { name: '文創手作', icon: 'assets/icons/bag-category.svg' },
    { name: '親子家庭', icon: 'assets/icons/family-category.svg' },
    { name: '寵物友善', icon: 'assets/icons/paw-category.svg' },
    { name: '生活風格', icon: 'assets/icons/gift-category.svg' },
    { name: '節慶限定', icon: 'assets/icons/balloon-category.svg' },
    { name: '假日市集', icon: 'assets/icons/holiday-category.svg' },
  ];
}