import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorApplicationRecord } from './vendor-application-record';

describe('VendorApplicationRecord', () => {
  let component: VendorApplicationRecord;
  let fixture: ComponentFixture<VendorApplicationRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorApplicationRecord]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorApplicationRecord);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
