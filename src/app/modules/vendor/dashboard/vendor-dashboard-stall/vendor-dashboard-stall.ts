import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/auth/auth.service';
import { AddressApiService } from '../../../../core/services/address-api.service';
import { AlertService } from '../../../../core/services/alert.service';
import { VendorAccessService } from '../../../../core/services/vendor-access.service';
import { VendorDashboardService } from '../../../../core/Vendor/dashboardApi/vendor-dashboard.service';
import { isApiSuccessStatus } from '../../../../models/interface/shared/ApiResult';
import {
  VendorStallInfo,
  VendorStallSaveRequest,
} from '../../../../models/interface/vendor/VendorStallInfo';
import { Dropdown } from '../../../shared/dropdown/dropdown';
import {
  VendorProduct,
  VendorProductModal,
} from '../modals/vendor-product-modal/vendor-product-modal';

interface StallField {
  label: string;
  name: string;
  type: 'text' | 'email' | 'select';
  value: string;
  options?: string[];
  required?: boolean;
}

interface UploadGuide {
  text: string;
}

@Component({
  selector: 'app-vendor-dashboard-stall',
  imports: [FormsModule, Dropdown, VendorProductModal],
  templateUrl: './vendor-dashboard-stall.html',
  styleUrl: './vendor-dashboard-stall.scss',
})
export class VendorDashboardStall implements OnInit {
  readonly maxProducts = 3;
  readonly invalidFields = new Set<string>();
  avatarPreview = '';
  coverPreview = '';
  armedBrandImage: 'avatar' | 'cover' | null = null;

  /** 基本資料先使用假資料綁定，之後串接 API 時可直接替換欄位 value。 */
  basicFields: StallField[] = [
    { label: '品牌名稱', name: 'brandName', type: 'text', value: '小集日工作室' },
    { label: '負責人姓名', name: 'ownerName', type: 'text', value: '小集日' },
    { label: '聯絡電話', name: 'phone', type: 'text', value: '0975-859-025' },
    { label: 'Email', name: 'email', type: 'email', value: 'littlemarket@gmail.com' },
    {
      label: '縣市',
      name: 'city',
      type: 'select',
      value: '台中市',
      options: [],
    },
    {
      label: '區',
      name: 'district',
      type: 'select',
      value: '南屯區',
      options: [],
    },
    { label: '詳細地址', name: 'address', type: 'text', value: '公益路二段 537 號' },
    { label: 'Instagram', name: 'instagram', type: 'text', value: '@littlemarket_day', required: false },
    { label: 'Facebook 粉絲專頁', name: 'facebook', type: 'text', value: '@littlemarket', required: false },
    { label: '官方網站', name: 'website', type: 'text', value: 'https://littlemarket.com', required: false },
  ];

  /** 大頭貼上傳規格說明，讓 template 以資料綁定方式渲染。 */
  avatarGuides: UploadGuide[] = [
    { text: '建議比例：1:1' },
    { text: '檔案格式：JPG / PNG' },
    { text: '檔案大小：最大 5MB' },
    { text: '上傳數量：僅限 1 個' },
    { text: '可上傳品牌或 LOGO 作為大頭貼' },
  ];

  /** 品牌封面上傳規格說明，之後若規格變更只需調整此陣列。 */
  coverGuides: UploadGuide[] = [
    { text: '建議尺寸 1200 x 600 像素' },
    { text: '檔案格式：JPG / PNG' },
    { text: '檔案大小：最大 5MB' },
    { text: '上傳數量：僅限 1 個' },
    { text: '封面將顯示於你的攤位頁面' },
  ];

  /** 品牌文字資料使用 ngModel 雙向綁定，方便後續整理成送出 payload。 */
  brandInfo = {
    description: '',
    category: '玩具收藏',
    categories: ['玩具收藏', '餐飲美食', '文創手作', '服飾配件', '寵物生活', '植物選物'],
    maxDescriptionLength: 500,
  };

  /** 品牌商品先以假資料呈現，之後可替換為攤主商品 API 回傳。 */
  products: VendorProduct[] = [
    {
      name: '小白狗尿尿',
      description: '可愛造型',
      price: 20,
      image: 'assets/images/user/brand/brands/brand-01/product-01.png',
    },
    {
      name: '躺躺',
      description: '很長',
      price: 250,
      image: 'assets/images/user/brand/brands/brand-01/product-02.png',
    },
  ];

  isProductModalOpen = false;
  editingProductIndex: number | null = null;

  isSaving = false;
  private isFirstLogin = false;
  private districtLoadId = 0;

  constructor(
    private readonly alert: AlertService,
    private readonly vendorDashboardService: VendorDashboardService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly vendorAccess: VendorAccessService,
    private readonly addressApiService: AddressApiService,
  ) {}

  ngOnInit(): void {
    this.initializeEmptyStallForm();
    this.loadCityOptions();
    this.initializeVendorDashboard();
  }

  private initializeVendorDashboard(): void {
    this.vendorDashboardService.getVendorFirstLogin().subscribe({
      next: (response) => {
        this.isFirstLogin = response.data?.needsProfileSetup === true;

        if (!this.isFirstLogin) {
          this.loadVendorStallInfo();
        }
      },
      error: () => {
        // 初始化失敗時仍載入既有資料，避免把一般使用者誤判為首次登入。
        this.loadVendorStallInfo();
      },
    });
  }

  private initializeEmptyStallForm(): void {
    const user = this.authService.getUser('vendor');
    const initialValues: Record<string, string> = {
      ownerName: user?.name?.trim() ?? '',
      email: user?.email?.trim() ?? '',
    };

    this.basicFields = this.basicFields.map((field) => ({
      ...field,
      value: initialValues[field.name] ?? '',
    }));
    this.avatarPreview = '';
    this.coverPreview = '';
    this.brandInfo.description = '';
    this.brandInfo.category = '';
    this.products = [];
  }

  private loadVendorStallInfo(): void {
    this.vendorDashboardService.getVendorStallInfo().subscribe({
      next: (response) => {
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          if (this.isFirstLogin && this.isMissingStallInfo(response.statusCode, response.message)) {
            return;
          }
          void this.alert.error('攤位資料載入失敗', response.message);
          return;
        }

        this.applyVendorStallInfo(response.data);
      },
      error: (error: unknown) => {
        if (this.isFirstLogin && this.isMissingStallInfoError(error)) {
          return;
        }
        void this.alert.error('攤位資料載入失敗', this.getErrorMessage(error));
      },
    });
  }

  private isMissingStallInfo(statusCode: number, message?: string): boolean {
    const normalizedMessage = message?.toLowerCase() ?? '';
    return statusCode === 404
      || normalizedMessage.includes('vendor profile not found')
      || normalizedMessage.includes('找不到攤主資料')
      || normalizedMessage.includes('找不到攤位資料');
  }

  private isMissingStallInfoError(error: unknown): boolean {
    if (!(error instanceof HttpErrorResponse)) {
      return false;
    }

    return this.isMissingStallInfo(error.status, error.error?.message);
  }

  private applyVendorStallInfo(data: VendorStallInfo): void {
    const user = this.authService.getUser('vendor');
    const fieldValues: Record<string, string> = {
      brandName: data.brandName ?? '',
      ownerName: data.contactName?.trim() || user?.name?.trim() || '',
      phone: data.contactPhone ?? '',
      email: data.contactEmail?.trim() || user?.email?.trim() || '',
      city: data.city ?? '',
      instagram: data.instagramUrl ?? '',
      district: data.district ?? '',
      facebook: data.facebookUrl ?? '',
      address: data.address ?? '',
      website: data.websiteUrl ?? '',
    };

    this.basicFields = this.basicFields.map((field) => ({
      ...field,
      value: fieldValues[field.name] ?? '',
    }));
    this.loadDistrictOptions(fieldValues['city'], fieldValues['district']);
    this.avatarPreview = data.avatarImageUrl ?? '';
    this.coverPreview = data.coverImageUrl ?? '';
    this.brandInfo.description = data.brandDescription || data.brandSummary || '';
    this.brandInfo.category = data.brandType ?? '';
    this.products = (data.products ?? []).map((product) => ({
      id: product.id,
      name: product.productName,
      description: product.productSummary,
      price: product.productPrice,
      image: product.productImageUrl ?? '',
    }));
  }

  async selectBrandImage(event: Event, type: 'avatar' | 'cover'): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      input.value = '';
      await this.alert.warning('圖片格式不符', '請上傳 JPG 或 PNG 格式的圖片。');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      input.value = '';
      await this.alert.warning('圖片檔案過大', '圖片大小不可超過 5MB。');
      return;
    }

    const preview = await this.readFileAsDataUrl(file);

    if (type === 'avatar') {
      this.avatarPreview = preview;
      this.armedBrandImage = null;
      this.clearInvalid('avatar');
      return;
    }

    this.coverPreview = preview;
    this.armedBrandImage = null;
    this.clearInvalid('cover');
  }

  prepareBrandImageRemoval(event: Event, type: 'avatar' | 'cover'): void {
    const target = event.target as Element;
    if (target.closest('.remove-brand-image')) return;
    if (!globalThis.matchMedia?.('(hover: none)').matches || this.armedBrandImage === type) return;

    event.preventDefault();
    event.stopPropagation();
    this.armedBrandImage = type;
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => resolve(String(reader.result ?? '')));
      reader.addEventListener('error', () => reject(reader.error));
      reader.readAsDataURL(file);
    });
  }

  removeBrandImage(type: 'avatar' | 'cover'): void {
    if (type === 'avatar') this.avatarPreview = '';
    else this.coverPreview = '';
    this.armedBrandImage = null;
    this.invalidFields.add(type);
  }

  updateBasicField(field: StallField, value: string): void {
    field.value = value;
    this.clearInvalid(field.name);

    if (field.name === 'city') {
      const districtField = this.getBasicField('district');
      if (districtField) {
        districtField.value = '';
      }
      this.clearInvalid('district');
      this.loadDistrictOptions(value);
    }
  }

  private loadCityOptions(): void {
    this.addressApiService.getAddressCities().subscribe({
      next: (response) => {
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          void this.alert.error('載入失敗', response.message || '無法取得縣市資料，請稍後再試。');
          return;
        }

        const cityField = this.getBasicField('city');
        if (cityField) {
          cityField.options = response.data;
        }
      },
      error: () => {
        void this.alert.error('載入失敗', '無法取得縣市資料，請稍後再試。');
      },
    });
  }

  private loadDistrictOptions(city: string, preferredDistrict = ''): void {
    const loadId = ++this.districtLoadId;
    const districtField = this.getBasicField('district');
    if (!districtField) return;

    districtField.options = [];
    if (!city) {
      districtField.value = '';
      return;
    }

    this.addressApiService.getAddressDistricts(city).subscribe({
      next: (response) => {
        if (loadId !== this.districtLoadId) return;
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          void this.alert.error('載入失敗', response.message || '無法取得行政區資料，請稍後再試。');
          return;
        }

        districtField.options = response.data;
        districtField.value = response.data.includes(preferredDistrict) ? preferredDistrict : '';
      },
      error: () => {
        if (loadId !== this.districtLoadId) return;
        void this.alert.error('載入失敗', '無法取得行政區資料，請稍後再試。');
      },
    });
  }

  private getBasicField(name: string): StallField | undefined {
    return this.basicFields.find((field) => field.name === name);
  }

  updateCategory(value: string): void {
    this.brandInfo.category = value;
    this.clearInvalid('category');
  }

  clearInvalid(field: string): void {
    this.invalidFields.delete(field);
  }

  /** 開啟攤主後台專用商品 Modal。 */
  async openAddProduct(): Promise<void> {
    if (this.products.length >= this.maxProducts) {
      await this.alert.warning(
        '商品數量已達上限',
        `每個品牌最多可新增 ${this.maxProducts} 個商品。`,
      );
      return;
    }

    this.editingProductIndex = null;
    this.isProductModalOpen = true;
  }

  /** 開啟編輯商品彈窗，帶入原資料並更新指定商品。 */
  openEditProduct(index: number): void {
    const currentProduct = this.products[index];

    if (!currentProduct) {
      return;
    }

    this.editingProductIndex = index;
    this.isProductModalOpen = true;
  }

  get editingProduct(): VendorProduct | null {
    return this.editingProductIndex === null ? null : this.products[this.editingProductIndex] ?? null;
  }

  closeProductModal(): void {
    this.isProductModalOpen = false;
    this.editingProductIndex = null;
  }

  handleProductSave(product: VendorProduct): void {
    if (this.editingProductIndex === null) {
      this.products = [...this.products, product];
    } else {
      const currentProduct = this.products[this.editingProductIndex];
      if (currentProduct && currentProduct.image !== product.image) {
        this.revokeObjectUrl(currentProduct.image);
      }
      this.products = this.products.map((item, index) =>
        index === this.editingProductIndex ? product : item,
      );
    }
    this.closeProductModal();
  }

  /** 刪除前使用共用確認視窗，確認後才移除對應商品。 */
  async deleteProduct(index: number): Promise<void> {
    const product = this.products[index];

    if (!product) {
      return;
    }

    const confirmed = await this.alert.confirm(
      '確定要刪除商品嗎？',
      `商品「${product.name}」刪除後將無法復原。`,
      '確認刪除',
      '取消',
    );

    if (!confirmed) {
      return;
    }

    this.revokeObjectUrl(product.image);
    this.products = this.products.filter((_, productIndex) => productIndex !== index);
  }

  /** 驗證並儲存目前攤位資料。 */
  saveChanges(): void {
    this.invalidFields.clear();

    for (const field of this.basicFields) {
      if (field.required !== false && !field.value.trim()) {
        this.invalidFields.add(field.name);
      }
    }

    if (!this.avatarPreview) this.invalidFields.add('avatar');
    if (!this.coverPreview) this.invalidFields.add('cover');
    if (!this.brandInfo.description.trim()) this.invalidFields.add('description');
    if (!this.brandInfo.category.trim()) this.invalidFields.add('category');

    if (this.invalidFields.size > 0) {
      document.querySelector<HTMLElement>('[data-invalid="true"]')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      return;
    }

    this.isSaving = true;
    const shouldReturnToDashboard = this.isFirstLogin;
    this.vendorDashboardService.saveVendorStallInfo(this.createSaveRequest()).subscribe({
      next: async (response) => {
        this.isSaving = false;
        if (!isApiSuccessStatus(response.statusCode) || !response.data) {
          void this.alert.error('攤位資料儲存失敗', response.message);
          return;
        }

        this.applyVendorStallInfo(response.data);
        this.isFirstLogin = false;
        await this.vendorAccess.refresh();
        await this.alert.success('儲存成功', response.message);
        if (shouldReturnToDashboard) {
          void this.router.navigate(['/vendor/dash-board/home']);
        }
      },
      error: (error: unknown) => {
        this.isSaving = false;
        void this.alert.error('攤位資料儲存失敗', this.getErrorMessage(error));
      },
    });
  }

  private createSaveRequest(): VendorStallSaveRequest {
    const values = Object.fromEntries(
      this.basicFields.map((field) => [field.name, field.value.trim()]),
    );
    const description = this.brandInfo.description.trim();

    return {
      brandName: values['brandName'] ?? '',
      contactName: values['ownerName'] ?? '',
      contactPhone: (values['phone'] ?? '').replace(/\D/g, ''),
      contactEmail: values['email'] ?? '',
      city: values['city'] ?? '',
      district: values['district'] ?? '',
      address: values['address'] ?? '',
      instagramUrl: values['instagram'] || null,
      facebookUrl: values['facebook'] || null,
      websiteUrl: values['website'] || null,
      avatarImageUrl: this.avatarPreview || null,
      coverImageUrl: this.coverPreview || null,
      brandSummary: description,
      brandDescription: description,
      brandType: this.brandInfo.category.trim(),
      products: this.products.map((product) => ({
        id: product.id,
        productName: product.name.trim(),
        productPrice: product.price,
        productSummary: product.description.trim(),
        productImageUrl: product.image || null,
      })),
    };
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message ?? error.message ?? '請稍後再試。';
    }
    return '請稍後再試。';
  }

  /** 避免編輯或刪除瀏覽器暫存圖片時留下 object URL。 */
  private revokeObjectUrl(image: string): void {
    if (image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
  }

}
