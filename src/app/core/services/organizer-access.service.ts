import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { isApiSuccessStatus } from '../../models/interface/shared/ApiResult';
import { OrganizerApiService } from './organizer-api.service';

@Injectable({ providedIn: 'root' })
export class OrganizerAccessService {
  private readonly needsProfileState = signal<boolean | null>(null);
  private initialization?: Promise<boolean>;

  readonly needsProfile = this.needsProfileState.asReadonly();

  constructor(private readonly organizerApiService: OrganizerApiService) {}

  initialize(force = false): Promise<boolean> {
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
        this.organizerApiService.getOrganizerDashboardInit(),
      );
      const needsProfile = isApiSuccessStatus(response.statusCode) && response.data
        ? response.data.needsProfile
        : true;
      this.needsProfileState.set(needsProfile);
      return needsProfile;
    } catch {
      // 無法確認主辦方資料狀態時先維持鎖定，避免繞過首次設定限制。
      this.needsProfileState.set(true);
      return true;
    }
  }
}
