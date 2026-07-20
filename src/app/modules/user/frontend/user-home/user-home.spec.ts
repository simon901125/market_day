import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AddressApiService } from '../../../../core/services/address-api.service';
import { UserMarketApiService } from '../../services/user-market-api.service';
import { UserHome } from './user-home';

describe('UserHome', () => {
  let component: UserHome;
  let fixture: ComponentFixture<UserHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserHome],
      providers: [
        provideRouter([]),
        {
          provide: UserMarketApiService,
          useValue: {
            searchMarkets: () => of({
              statusCode: 200,
              data: {
                items: [], page: 1, pageSize: 3, totalItems: 0, totalPages: 0,
                hasPrevious: false, hasNext: false,
              },
            }),
          },
        },
        {
          provide: AddressApiService,
          useValue: { getAddressCities: () => of({ statusCode: 200, data: [] }) },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
