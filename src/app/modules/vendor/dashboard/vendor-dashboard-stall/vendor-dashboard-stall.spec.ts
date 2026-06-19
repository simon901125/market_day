import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorDashboardStall } from './vendor-dashboard-stall';

describe('VendorDashboardStall', () => {
  let component: VendorDashboardStall;
  let fixture: ComponentFixture<VendorDashboardStall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDashboardStall],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardStall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render stall data by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;
    const firstInput: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(textContent).toContain('基本資料');
    expect(firstInput.value).toBe(component.basicFields[0].value);
    expect(textContent).toContain(component.products[0].name);
  });
});
