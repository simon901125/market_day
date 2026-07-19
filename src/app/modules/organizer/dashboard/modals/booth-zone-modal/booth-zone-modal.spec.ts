import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothZoneModal } from './booth-zone-modal';

describe('BoothZoneModal', () => {
  let component: BoothZoneModal;
  let fixture: ComponentFixture<BoothZoneModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoothZoneModal],
    }).compileComponents();

    fixture = TestBed.createComponent(BoothZoneModal);
    component = fixture.componentInstance;
    component.draft = { name: '', color: '#F97316', count: 1 };
    fixture.detectChanges();
  });

  it('provides exactly A 區 through Z 區', () => {
    expect(component.zoneNameOptions.length).toBe(26);
    expect(component.zoneNameOptions[0]).toBe('A 區');
    expect(component.zoneNameOptions[25]).toBe('Z 區');
  });

  it('rejects a numeric zone name', () => {
    component.draft.name = '1 區';

    expect(component.nameInvalid).toBeTrue();
    expect(component.formInvalid).toBeTrue();
  });

  it('disables a zone name already used by another zone', () => {
    component.existingZoneNames = ['A 區'];
    component.draft.name = 'A 區';

    expect(component.nameDuplicate).toBeTrue();
    expect(component.isZoneNameUsed('A 區')).toBeTrue();
  });
});
