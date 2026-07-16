import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { VendorDashboardService } from '../Vendor/dashboardApi/vendor-dashboard.service';

@Injectable({ providedIn: 'root' })
export class VendorAccessService {
  private readonly needsProfileState = signal<boolean | null>(null);
  private initialization?: Promise<boolean>;

  readonly needsProfile = this.needsProfileState.asReadonly();

  constructor(
    private readonly authService: AuthService,
    private readonly vendorDashboardService: VendorDashboardService,
  ) {}

  initialize(force = false): Promise<boolean> {
    if (!this.authService.isLoggedIn('vendor')) {
      this.needsProfileState.set(false);
      return Promise.resolve(false);
    }

    const currentValue = this.needsProfileState();
    if (!force && currentValue !== null) {
      return Promise.resolve(currentValue);
    }

    if (this.initialization) {
      return this.initialization;
    }

    this.initialization = this.loadState().finally(() => {
      this.initialization = undefined;
    });
    return this.initialization;
  }

  refresh(): Promise<boolean> {
    return this.initialize(true);
  }

  private async loadState(): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.vendorDashboardService.getVendorFirstLogin(),
      );
      const needsProfile = typeof response.data?.needsProfile === 'boolean'
        ? response.data.needsProfile
        : true;
      this.needsProfileState.set(needsProfile);
      return needsProfile;
    } catch {
      // 無法確認攤位資料狀態時先鎖定，避免略過首次設定限制。
      this.needsProfileState.set(true);
      return true;
    }
  }
}
