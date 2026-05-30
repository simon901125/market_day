import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrandserchTag } from './user-brandserch-tag';

describe('UserBrandserchTag', () => {
  let component: UserBrandserchTag;
  let fixture: ComponentFixture<UserBrandserchTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandserchTag],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBrandserchTag);
    component = fixture.componentInstance;
    component.label = '手作飾品';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.brandserch-tag');
    expect(btn.textContent?.trim()).toBe('手作飾品');
  });

  it('should have active class when active is true', () => {
    component.active = true;
    fixture.detectChanges();
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.brandserch-tag');
    expect(btn.classList).toContain('active');
  });

  it('should emit tagClick on button click', () => {
    spyOn(component.tagClick, 'emit');
    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.brandserch-tag');
    btn.click();
    expect(component.tagClick.emit).toHaveBeenCalled();
  });
});
