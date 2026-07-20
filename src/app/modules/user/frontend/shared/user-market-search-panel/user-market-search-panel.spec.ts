import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AddressApiService } from '../../../../../core/services/address-api.service';
import { UserMarketSearchPanel } from './user-market-search-panel';

describe('UserMarketSearchPanel', () => {
  let component: UserMarketSearchPanel;
  let fixture: ComponentFixture<UserMarketSearchPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMarketSearchPanel],
      providers: [
        provideRouter([]),
        {
          provide: AddressApiService,
          useValue: { getAddressCities: () => of({ statusCode: 200, data: ['台北市'] }) },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMarketSearchPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
