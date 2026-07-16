import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DashboardPagination } from '../../../shared/dashboard/dashboard-pagination/dashboard-pagination';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import { BoothStatus } from '../../../../models/status/BoothStatus';

interface BoothRow { code: string; zone: string; size: string; selected: boolean; brand: string; category: string; vendor: string; selectedAt: string; }

@Component({ selector: 'app-organizer-dashboard-stall-detail', imports: [FormsModule, RouterLink, DashboardPagination, Dropdown], templateUrl: './organizer-dashboard-stall-detail.html', styleUrl: './organizer-dashboard-stall-detail.scss' })
export class OrganizerDashboardStallDetail implements OnInit {
  readonly boothStatus = BoothStatus;
  selectedDate = '2026/07/18';
  activeTab: 'all' | 'available' | 'selected' = 'all';
  keyword = '';
  currentPage = 1;
  readonly pageSize = 5;
  readonly dates = ['2026/07/18', '2026/07/19'];
  readonly booths: BoothRow[] = [
    { code: 'A01', zone: 'A 區', size: '2m × 3m', selected: true, brand: '森林選物', category: '植物選物', vendor: '林小森', selectedAt: '2026/06/01 10:30' },
    { code: 'A02', zone: 'A 區', size: '2m × 3m', selected: false, brand: '-', category: '-', vendor: '-', selectedAt: '-' },
    { code: 'A03', zone: 'A 區', size: '2m × 3m', selected: false, brand: '-', category: '-', vendor: '-', selectedAt: '-' },
    { code: 'B01', zone: 'B 區', size: '3m × 3m', selected: true, brand: '小日子甜點', category: '餐飲美食', vendor: '陳甜甜', selectedAt: '2026/06/01 11:15' },
    { code: 'B02', zone: 'B 區', size: '3m × 3m', selected: false, brand: '-', category: '-', vendor: '-', selectedAt: '-' },
    { code: 'C01', zone: 'C 區', size: '3m × 4m', selected: false, brand: '-', category: '-', vendor: '-', selectedAt: '-' },
  ];

  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}
  ngOnInit(): void { this.currentPage = Math.max(1, Number(this.route.snapshot.queryParamMap.get('page')) || 1); }
  get filteredBooths(): BoothRow[] { const key = this.keyword.trim().toLowerCase(); return this.booths.filter(b => (this.activeTab === 'all' || (this.activeTab === 'selected') === b.selected) && (!key || `${b.code}${b.brand}`.toLowerCase().includes(key))); }
  get displayBooths(): BoothRow[] { const start = (this.currentPage - 1) * this.pageSize; return this.filteredBooths.slice(start, start + this.pageSize); }
  count(type: 'all'|'available'|'selected'): number { return type === 'all' ? 150 : type === 'selected' ? this.booths.filter(b => b.selected).length : 150 - this.booths.filter(b => b.selected).length; }
  setTab(tab: 'all'|'available'|'selected'): void { this.activeTab = tab; this.currentPage = 1; }
  onPageChange(page: number): void { this.currentPage = page; }
  openBoothMap(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '1';
    this.router.navigate(['/organizer/dash-board/stall/detail', id, 'map'], {
      queryParams: {
        returnPage: this.route.snapshot.queryParamMap.get('returnPage'),
        returnKeyword: this.route.snapshot.queryParamMap.get('returnKeyword'),
        returnStatus: this.route.snapshot.queryParamMap.get('returnStatus'),
      },
    });
  }
  goBack(): void { this.router.navigate(['/organizer/dash-board/stall'], { queryParams: { page: this.route.snapshot.queryParamMap.get('returnPage'), keyword: this.route.snapshot.queryParamMap.get('returnKeyword'), status: this.route.snapshot.queryParamMap.get('returnStatus') } }); }
}
