import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSerchInput } from './admin-dashboard-serch-input';

describe('AdminDashboardSerchInput', () => {
  let component: AdminDashboardSerchInput;
  let fixture: ComponentFixture<AdminDashboardSerchInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSerchInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSerchInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reset() 應清空 inputValue 並清空畫面上輸入框顯示的文字', () => {
    const inputEl: HTMLInputElement = fixture.nativeElement.querySelector('input');
    inputEl.value = '測試關鍵字';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.inputValue).toBe('測試關鍵字');

    component.reset();
    fixture.detectChanges();

    expect(component.inputValue).toBe('');
    expect(inputEl.value).toBe('');
  });
});
