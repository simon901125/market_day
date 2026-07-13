import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertService } from '../../../../core/services/alert.service';
import { VendorDashboardStall } from './vendor-dashboard-stall';

describe('VendorDashboardStall', () => {
  let component: VendorDashboardStall;
  let fixture: ComponentFixture<VendorDashboardStall>;
  let alert: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorDashboardStall],
    }).compileComponents();

    fixture = TestBed.createComponent(VendorDashboardStall);
    component = fixture.componentInstance;
    alert = TestBed.inject(AlertService);
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

  it('should open the product modal and append the saved product', async () => {
    const newProduct = {
      name: '新商品',
      description: '商品介紹',
      price: 180,
      image: 'blob:new-product',
    };
    await component.openAddProduct();
    expect(component.isProductModalOpen).toBeTrue();

    component.handleProductSave(newProduct);

    expect(component.products.at(-1)).toEqual(newProduct);
    expect(component.isProductModalOpen).toBeFalse();
  });

  it('should show warning instead of form when product limit is reached', async () => {
    component.products = [
      ...component.products,
      {
        name: '第三個商品',
        description: '商品介紹',
        price: 100,
        image: 'third-product.png',
      },
    ];
    const warningSpy = spyOn(alert, 'warning').and.resolveTo({} as never);

    await component.openAddProduct();

    expect(warningSpy).toHaveBeenCalled();
    expect(component.isProductModalOpen).toBeFalse();
  });

  it('should update the selected product returned from the product modal', async () => {
    const editedProduct = {
      ...component.products[0],
      name: '編輯後商品',
      price: 320,
    };
    component.openEditProduct(0);
    expect(component.editingProduct).toEqual(component.products[0]);

    component.handleProductSave(editedProduct);

    expect(component.products[0]).toEqual(editedProduct);
  });

  it('should delete the selected product after confirmation', async () => {
    const deletedProduct = component.products[0];
    spyOn(alert, 'confirm').and.resolveTo(true);

    await component.deleteProduct(0);

    expect(component.products).not.toContain(deletedProduct);
  });

  it('should keep the product when deletion is cancelled', async () => {
    const originalProducts = [...component.products];
    spyOn(alert, 'confirm').and.resolveTo(false);

    await component.deleteProduct(0);

    expect(component.products).toEqual(originalProducts);
  });
});
