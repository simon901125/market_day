import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { MarketCardItem } from '../../../../models/interface/shared/MarketCardItem';
import { VendorSignupForm } from './vendor-signup-form';

describe('VendorSignupForm', () => {
  let component: VendorSignupForm;
  let fixture: ComponentFixture<VendorSignupForm>;
  let router: Router;

  const market: MarketCardItem = {
    id: 'market-1',
    title: '新動市集｜貓貓森林市',
    time: '10:00－18:00',
    start_date: '2026/05/30',
    end_date: '2026/05/31',
    description: '測試市集',
    location: '宜蘭車站前航空園區森林廣場',
    address: '宜蘭縣宜蘭市光復路 1 號',
    city: '宜蘭縣',
    area: '宜蘭市',
    image: 'market.png',
    status: '報名中',
    statusClass: 'open',
    tags: ['文創手作', '寵物生活', '植物選物', '生活選物'],
    category: '生活市集',
    organizer: '小集日',
    transportation: [],
    price: 650,
    slots: [
      { date: '05/30', remaining: 120 },
      { date: '05/31', remaining: 85 },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSignupForm],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorSignupForm);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    component.market = market;
    component.selectedDates = {
      '05/30': true,
      '05/31': true,
    };
    fixture.detectChanges();
  });

  it('should create and render bound market data', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(component).toBeTruthy();
    expect(textContent).toContain(market.title);
    expect(textContent).toContain(market.location);
    expect(textContent).toContain('報名摘要');
  });

  it('should calculate the fee summary from selected data', () => {
    expect(component.selectedDays).toBe(2);
    expect(component.boothSubtotal).toBe(1300);
    expect(component.equipmentSubtotal).toBe(200);
    expect(component.powerSubtotal).toBe(600);
    expect(component.totalFee).toBe(3100);
  });

  it('should build selectable dates when market slots are missing', () => {
    component.market = {
      ...market,
      slots: undefined,
    };

    expect(component.slots.map((slot) => slot.date)).toEqual(['05/30', '05/31']);
  });

  it('should update equipment quantity and selection together', () => {
    const extension = component.equipment.find((item) => item.id === 'extension')!;

    component.changeEquipmentQuantity(extension, 1);

    expect(extension.quantity).toBe(1);
    expect(extension.selected).toBeTrue();
    expect(component.equipmentSubtotal).toBe(250);
  });

  it('should navigate to confirmation with the complete signup payload', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.formData.vehicleNumber = 'ABC-1234';

    component.goToConfirm();

    expect(navigateSpy).toHaveBeenCalled();
    const navigationExtras = navigateSpy.calls.mostRecent().args[1];
    expect(navigationExtras?.state?.['signup'].selectedSlots.length).toBe(2);
    expect(navigationExtras?.state?.['signup'].totalFee).toBe(3100);
  });
});
