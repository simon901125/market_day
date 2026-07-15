import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AlertService } from '../../../../core/services/alert.service';
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
export class VendorDashboardStall {
  readonly maxProducts = 3;
  readonly invalidFields = new Set<string>();
  avatarPreview = '';
  coverPreview = '';

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
      options: ['台北市', '新北市', '台中市', '台南市', '高雄市'],
    },
    { label: 'Instagram', name: 'instagram', type: 'text', value: '@littlemarket_day' },
    {
      label: '區',
      name: 'district',
      type: 'select',
      value: '南屯區',
      options: ['中區', '西區', '南屯區', '北屯區', '西屯區'],
    },
    { label: 'Facebook 粉絲專頁', name: 'facebook', type: 'text', value: '@littlemarket' },
    { label: '詳細地址', name: 'address', type: 'text', value: '公益路二段 537 號' },
    { label: '官方網站', name: 'website', type: 'text', value: 'https://littlemarket.com' },
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

  constructor(private readonly alert: AlertService) {}

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
      this.clearInvalid('avatar');
      return;
    }

    this.coverPreview = preview;
    this.clearInvalid('cover');
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
    this.invalidFields.add(type);
  }

  updateBasicField(field: StallField, value: string): void {
    field.value = value;
    this.clearInvalid(field.name);
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

  /** 儲存目前表單資料；串接 API 時可在此送出攤位資料。 */
  saveChanges(): void {
    this.invalidFields.clear();

    for (const field of this.basicFields) {
      if (!field.value.trim()) this.invalidFields.add(field.name);
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

    console.log('stall form saved', {
      basicFields: this.basicFields,
      brandInfo: this.brandInfo,
      products: this.products,
    });
  }

  /** 避免編輯或刪除瀏覽器暫存圖片時留下 object URL。 */
  private revokeObjectUrl(image: string): void {
    if (image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
  }

}
