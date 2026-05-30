import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBrandserch } from './user-brandserch';

describe('UserBrandserch', () => {
  let component: UserBrandserch;
  let fixture: ComponentFixture<UserBrandserch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserBrandserch],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBrandserch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 brands', () => {
    expect(component.brands.length).toBe(6);
  });

  it('should default activeTagIndex to 0', () => {
    expect(component.activeTagIndex).toBe(0);
  });

  it('should update activeTagIndex when selectTag is called', () => {
    component.selectTag(3);
    expect(component.activeTagIndex).toBe(3);
  });
});
