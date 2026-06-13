import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMarketCard } from './vendor-market-card';

describe('VendorMarketCard', () => {
  let component: VendorMarketCard;
  let fixture: ComponentFixture<VendorMarketCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorMarketCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorMarketCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
