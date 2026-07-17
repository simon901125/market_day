import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AddressApiService } from '../../../../core/services/address-api.service';
import { VendorMarketSearchPanel } from './vendor-market-search-panel';

describe('VendorMarketSearchPanel', () => {
  let component: VendorMarketSearchPanel;
  let fixture: ComponentFixture<VendorMarketSearchPanel>;
  const addressApiService = {
    getAddressCities: () => of({ statusCode: 200, message: 'success', data: ['台北市'] }),
    getAddressDistricts: () => of({ statusCode: 200, message: 'success', data: ['中正區'] }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMarketSearchPanel],
      providers: [{ provide: AddressApiService, useValue: addressApiService }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMarketSearchPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
