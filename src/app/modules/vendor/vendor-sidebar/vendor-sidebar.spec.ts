import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSidebar } from './vendor-sidebar';

describe('VendorSidebar', () => {
  let component: VendorSidebar;
  let fixture: ComponentFixture<VendorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
