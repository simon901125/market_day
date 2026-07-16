import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { VendorService } from '../../../../core/Vendor/vendorApi/vendor.service';
import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import {
  MarketRegistrationStatus,
  VendorMarketSearchItem,
} from '../../../../models/interface/vendor/VendorMarketSearch';
import { MarketStatus } from '../../../../models/status/MarketStatus';
import { UserFooter } from '../../../user/frontend/shared/user-footer/user-footer';
import { VendorHeader } from '../vendor-header/vendor-header';
import { VendorMarketCard } from '../vendor-market-card/vendor-market-card';

@Component({
  selector: 'app-vendor-home',
  imports: [VendorHeader, UserFooter, VendorMarketCard, RouterLink],
  templateUrl: './vendor-home.html',
  styleUrl: './vendor-home.scss',
})
export class VendorHome implements OnInit {
  markets: MarketCardItem[] = [];
  isLoadingMarkets = false;
  marketLoadError = '';

  constructor(
    private readonly router: Router,
    private readonly vendorService: VendorService,
  ) {}

  ngOnInit(): void {
    this.loadRecentMarkets();
  }

  private loadRecentMarkets(): void {
    this.isLoadingMarkets = true;
    this.marketLoadError = '';

    this.vendorService
      .searchMarkets({
        status: 'OPEN',
        eventStartAt: new Date(),
        page: 1,
        pageSize: 3,
      })
      .subscribe({
        next: (response) => {
          this.markets = response.data.markets.items.map((item) => this.toMarketCard(item));
          this.isLoadingMarkets = false;
        },
        error: () => {
          this.markets = [];
          this.marketLoadError = '近期市集載入失敗，請稍後再試。';
          this.isLoadingMarkets = false;
        },
      });
  }

  private toMarketCard(item: VendorMarketSearchItem): MarketCardItem {
    const startAt = new Date(item.startAt);
    const endAt = new Date(item.endAt);
    const status = this.toMarketStatus(item.registrationStatus);

    return {
      id: String(item.eventId),
      title: item.eventTitle,
      time: `${this.formatTime(startAt)} - ${this.formatTime(endAt)}`,
      start_date: this.formatDate(startAt),
      end_date: this.formatDate(endAt),
      description: item.summary,
      location: item.locationName,
      address: item.address,
      city: item.city,
      area: item.district,
      image: item.imageUrl || 'assets/images/market/cards/market-card-01.png',
      status,
      statusClass: MarketStatus.getClass(status),
      tags: item.categoryName ? [item.categoryName] : [],
      category: item.categoryName ?? '',
      organizer: item.organizerName ?? '',
      transportation: [item.trafficTitle, item.trafficDetail].filter(
        (value): value is string => Boolean(value),
      ),
      price: item.baseFee,
      maxBooths: item.maxBooths,
      registrationStartAt: item.registrationStartAt ?? undefined,
      registrationEndAt: item.registrationEndAt ?? undefined,
      trafficTitle: item.trafficTitle ?? '',
      trafficDetail: item.trafficDetail ?? '',
      slots: [],
    };
  }

  private toMarketStatus(status: MarketRegistrationStatus): string {
    const statusMap: Record<MarketRegistrationStatus, string> = {
      OPEN: MarketStatus.active,
      UPCOMING: MarketStatus.preview,
      CLOSED: MarketStatus.ended,
    };
    return statusMap[status];
  }

  private formatDate(value: Date): string {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  private formatTime(value: Date): string {
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  goToSignUpDetail(market: MarketCardItem): void {
    const commands = market.id
      ? ['/vendor/sign-up-detail', market.id]
      : ['/vendor/sign-up-detail'];
    this.router.navigate(commands, {
      state: { market },
    });
  }
}
