import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-vendor-market-search-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-market-search-panel.html',
  styleUrl: './vendor-market-search-panel.scss',
})
export class VendorMarketSearchPanel {
  keyword = '';
  selectedArea = '';
  selectedCity = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';

  areas: string[] = ['北部', '中部', '南部', '東部', '離島'];

  cities: string[] = [
    '台北市',
    '新北市',
    '桃園市',
    '新竹市',
    '台中市',
    '台南市',
    '高雄市',
    '宜蘭縣',
  ];

  statuses: string[] = ['報名中', '即將開放', '已額滿', '已截止'];
}
