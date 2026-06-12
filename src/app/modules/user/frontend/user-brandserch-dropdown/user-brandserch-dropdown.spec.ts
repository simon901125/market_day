import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrandserchDropdown } from './user-brandserch-dropdown';

describe('UserBrandserchDropdown', () => {
  let component: UserBrandserchDropdown;
  let fixture: ComponentFixture<UserBrandserchDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandserchDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBrandserchDropdown);
    component = fixture.componentInstance;
    component.options = ['選項A', '選項B', '選項C'];
    component.isOpen = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all options', () => {
    const items = fixture.nativeElement.querySelectorAll('.dropdown-item');
    expect(items.length).toBe(3);
  });

  it('should emit optionSelected and closed on item click', () => {
    spyOn(component.optionSelected, 'emit');
    spyOn(component.closed, 'emit');
    const item: HTMLElement = fixture.nativeElement.querySelector('.dropdown-item');
    item.click();
    expect(component.optionSelected.emit).toHaveBeenCalledWith('選項A');
    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should not render list when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('.dropdown-list');
    expect(list).toBeNull();
  });
});
