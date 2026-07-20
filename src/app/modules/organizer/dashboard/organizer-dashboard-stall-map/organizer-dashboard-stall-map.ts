import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { OrganizerApiService } from '../../../../core/services/organizer-api.service';
import { MarketMapData } from '../../../../models/interface/shared/MarketMap';
import { MarketMap, DEFAULT_MARKET_MAP_DATA } from '../../../shared/market-map/market-map';

@Component({
  selector: 'app-organizer-dashboard-stall-map',
  imports: [RouterLink, MarketMap],
  templateUrl: './organizer-dashboard-stall-map.html',
  styleUrl: './organizer-dashboard-stall-map.scss',
})
export class OrganizerDashboardStallMap implements OnInit {
  eventId = 0;
  event = { name: '-', date: '-', time: '-', place: '-', total: 0, available: 0, selected: 0 };
  mapData: MarketMapData = DEFAULT_MARKET_MAP_DATA;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly organizerApi: OrganizerApiService,
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId > 0) void this.loadMap();
  }

  goBack(): void {
    this.router.navigate(['/organizer/dash-board/stall/detail', this.eventId], {
      queryParams: { returnPage: this.route.snapshot.queryParamMap.get('returnPage'), returnKeyword: this.route.snapshot.queryParamMap.get('returnKeyword'), returnStatus: this.route.snapshot.queryParamMap.get('returnStatus') },
    });
  }

  private async loadMap(): Promise<void> {
    try {
      const applyDate = this.route.snapshot.queryParamMap.get('applyDate')?.replaceAll('/', '-');
      const response = await firstValueFrom(this.organizerApi.getOrganizerStallMap(this.eventId, { applyDate: applyDate || undefined }));
      const data = response.data;
      const start = new Date(data.event.startAt); const end = new Date(data.event.endAt);
      this.event = {
        name: data.event.eventTitle || '-',
        date: `${this.dateOnly(start)} - ${this.dateOnly(end)}`,
        time: `${this.timeOnly(start)} - ${this.timeOnly(end)}`,
        place: data.event.locationName || data.event.address || '-',
        total: data.event.totalStallCount ?? 0,
        available: data.event.availableStallCount ?? 0,
        selected: data.event.selectedStallCount ?? 0,
      };
      const apiStalls = new Map((data.stalls ?? []).flatMap((zone) => zone.stalls.map((stall) => [stall.stallNo, { stall, zone: zone.zoneName }] as const)));
      this.mapData = {
        ...DEFAULT_MARKET_MAP_DATA,
        name: data.event.eventTitle,
        booths: DEFAULT_MARKET_MAP_DATA.booths.map((booth) => {
          const api = apiStalls.get(booth.code);
          if (!api) return booth;
          const vendor = api.stall.selectedVendor;
          const selected = api.stall.status === '已選擇' || api.stall.status === '系統分配';
          return {
            ...booth,
            zone: api.zone,
            status: selected ? 'selected' as const : 'available' as const,
            size: api.stall.length && api.stall.width ? `${api.stall.length}m × ${api.stall.width}m` : booth.size,
            brand: vendor?.name ? { id: String(api.stall.selectedApplicationId ?? api.stall.stallId), name: vendor.name, category: vendor.category?.name || '-', summary: '', logo: '' } : undefined,
          };
        }),
      };
    } catch {
      this.mapData = DEFAULT_MARKET_MAP_DATA;
    }
  }

  private dateOnly(value: Date): string { return Number.isNaN(value.getTime()) ? '-' : value.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' }); }
  private timeOnly(value: Date): string { return Number.isNaN(value.getTime()) ? '-' : value.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }); }
}
