import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AddressApiService } from '../../../../../core/services/address-api.service';
import { AlertService } from '../../../../../core/services/alert.service';
import { UserMarketApiService } from '../../../services/user-market-api.service';
import { UserActivityList } from './user-activity-list';

describe('UserActivityList', () => {
  let component: UserActivityList;
  let fixture: ComponentFixture<UserActivityList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserActivityList],
      providers: [
        provideRouter([]),
        {
          provide: UserMarketApiService,
          useValue: {
            searchMarkets: () => of({
              statusCode: 200,
              data: {
                items: [], page: 1, pageSize: 6, totalItems: 0, totalPages: 0,
                hasPrevious: false, hasNext: false,
              },
            }),
          },
        },
        {
          provide: AddressApiService,
          useValue: { getAddressCities: () => of({ statusCode: 200, data: [] }) },
        },
        { provide: AlertService, useValue: { error: () => Promise.resolve() } },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserActivityList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
