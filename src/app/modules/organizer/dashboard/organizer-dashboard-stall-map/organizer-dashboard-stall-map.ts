import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MarketMap } from '../../../shared/market-map/market-map';

@Component({
  selector: 'app-organizer-dashboard-stall-map',
  imports: [RouterLink, MarketMap],
  templateUrl: './organizer-dashboard-stall-map.html',
  styleUrl: './organizer-dashboard-stall-map.scss',
})
export class OrganizerDashboardStallMap {
  constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

  goBack(): void {
    const id = this.route.snapshot.paramMap.get('id') ?? '1';
    this.router.navigate(['/organizer/dash-board/stall/detail', id], {
      queryParams: {
        returnPage: this.route.snapshot.queryParamMap.get('returnPage'),
        returnKeyword: this.route.snapshot.queryParamMap.get('returnKeyword'),
        returnStatus: this.route.snapshot.queryParamMap.get('returnStatus'),
      },
    });
  }
}
