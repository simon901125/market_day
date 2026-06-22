import { Component, Input } from '@angular/core';
import { CategoryItem } from '../../../../../models/interface/user/CategoryItem';
import { RouterLink } from '@angular/router';
import { Dropdown } from '../../../../shared/dropdown/dropdown';
import { DateRangeSelector } from '../../../../shared/date-range-selector/date-range-selector';
import { TAIWAN_CITY_OPTIONS } from '../../../../../models/config/TaiwanAdministrativeDivisions';

@Component({
  selector: 'app-user-market-search-panel',
  imports: [RouterLink, Dropdown, DateRangeSelector],
  templateUrl: './user-market-search-panel.html',
  styleUrl: './user-market-search-panel.scss',
})

export class UserMarketSearchPanel {
  /** 日期區間標題由使用頁面決定，預設不顯示。 */
  @Input() dateRangeTitle = '';

  /** 全台縣市 */
  readonly cityOptions = TAIWAN_CITY_OPTIONS;

  /** 市集活動狀態 */
  readonly statusOptions = ['活動預告', '即將開始', '進行中'];

  selectedCity = '';
  selectedStatus = '';

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

  selectCity(city: string): void {
    this.selectedCity = city;
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
  }
}
