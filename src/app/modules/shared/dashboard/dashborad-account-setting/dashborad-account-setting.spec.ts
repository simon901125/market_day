import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DashboradAccountSetting } from './dashborad-account-setting';

describe('DashboradAccountSetting', () => {
  let component: DashboradAccountSetting;
  let fixture: ComponentFixture<DashboradAccountSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradAccountSetting],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboradAccountSetting);
    component = fixture.componentInstance;
    component.account = {
      name: '測試攤主',
      email: 'vendor@example.com',
      googleBound: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render account data by binding', () => {
    const textContent: string = fixture.nativeElement.textContent;

    expect(textContent).toContain('測試攤主');
    expect(textContent).toContain('vendor@example.com');
    expect(textContent).toContain('未綁定');
  });

  it('should emit closed event', () => {
    const closeSpy = spyOn(component.closed, 'emit');

    component.close();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should open shared password setting', () => {
    component.openPasswordSetting();
    fixture.detectChanges();

    expect(component.passwordSettingOpen).toBeTrue();
    expect(fixture.nativeElement.textContent).toContain('為了保護帳號安全');
  });
});
