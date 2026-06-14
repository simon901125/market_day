import { Component } from '@angular/core';
import { AdminDashboardDropdown } from '../shared/admin-dashboard-dropdown/admin-dashboard-dropdown';

@Component({
  selector: 'app-admin-dashboard-market-managemant',
  imports: [AdminDashboardDropdown],
  templateUrl: './admin-dashboard-market-managemant.html',
  styleUrl: './admin-dashboard-market-managemant.scss',
})
export class AdminDashboardMarketManagemant {

  /**主辦方下拉選單 */
  organizerOptions = ['森林生活市集', '日日好市', '春語市集', '歡樂市集團隊'];
}
