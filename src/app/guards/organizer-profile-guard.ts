import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, map } from 'rxjs';

import { OrganizerAccessService } from '../core/services/organizer-access.service';

export const organizerProfileGuard: CanActivateFn = () => {
  const organizerAccess = inject(OrganizerAccessService);
  const router = inject(Router);

  return from(organizerAccess.initialize(true)).pipe(
    map((needsProfile) => needsProfile
      ? router.createUrlTree(['/organizer/dash-board/home'])
      : true),
  );
};
