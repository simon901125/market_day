import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AlertService } from '../../../../core/services/alert.service';

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

interface StallProduct {
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-vendor-dashboard-stall',
  imports: [FormsModule],
  templateUrl: './vendor-dashboard-stall.html',
  styleUrl: './vendor-dashboard-stall.scss',
})
export class VendorDashboardStall {
  readonly maxProducts = 3;

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
    { text: '建議尺寸 1:1' },
    { text: '檔案格式：JPG / PNG' },
    { text: '檔案大小：最大 5MB' },
    { text: '可上傳品牌或 LOGO 作為大頭貼' },
  ];

  /** 品牌封面上傳規格說明，之後若規格變更只需調整此陣列。 */
  coverGuides: UploadGuide[] = [
    { text: '建議尺寸 1200 x 600 像素' },
    { text: '檔案格式：JPG / PNG' },
    { text: '檔案大小：最大 5MB' },
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
  products: StallProduct[] = [
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

  constructor(private readonly alert: AlertService) {}

  /** 開啟共用 SweetAlert 商品表單，確認後將新商品加入資料綁定陣列。 */
  async openAddProduct(): Promise<void> {
    if (this.products.length >= this.maxProducts) {
      await this.alert.warning(
        '商品數量已達上限',
        `每個品牌最多可新增 ${this.maxProducts} 個商品。`,
      );
      return;
    }

    const result = await this.openProductForm();

    if (!result.isConfirmed || !result.value) {
      return;
    }

    this.products = [...this.products, result.value];
  }

  /** 開啟編輯商品彈窗，帶入原資料並更新指定商品。 */
  async openEditProduct(index: number): Promise<void> {
    const currentProduct = this.products[index];

    if (!currentProduct) {
      return;
    }

    const result = await this.openProductForm(currentProduct);

    if (!result.isConfirmed || !result.value) {
      return;
    }

    if (result.value.image !== currentProduct.image) {
      this.revokeObjectUrl(currentProduct.image);
    }

    this.products = this.products.map((product, productIndex) =>
      productIndex === index ? result.value! : product,
    );
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
    console.log('stall form saved', {
      basicFields: this.basicFields,
      brandInfo: this.brandInfo,
      products: this.products,
    });
  }

  /** 以同一個共用 Alert 表單處理新增與編輯商品。 */
  private openProductForm(product?: StallProduct) {
    return this.alert.custom<StallProduct>({
      html: this.getProductFormHtml(product),
      showCancelButton: true,
      confirmButtonText: product ? '儲存變更' : '新增商品',
      cancelButtonText: '取消',
      reverseButtons: true,
      focusConfirm: false,
      customClass: {
        popup: 'product-form-swal',
      },
      didOpen: () => this.bindProductImageName(),
      preConfirm: () => this.readProductForm(product?.image),
    });
  }

  /** 建立商品表單，編輯模式會預先帶入原商品資料與圖片。 */
  private getProductFormHtml(product?: StallProduct): string {
    const name = this.escapeHtml(product?.name ?? '');
    const description = this.escapeHtml(product?.description ?? '');
    const price = product?.price ?? '';
    const imageControl = product
      ? `
        <div class="product-edit-image">
          <img id="stallProductPreview" src="${this.escapeHtml(product.image)}" alt="${name}">
         
        </div>
      `
      : `
        <label class="product-image-upload" for="stallProductImage">
          <i class="bi bi-plus-circle"></i>
          <strong>點擊上傳圖片</strong>
          <input id="stallProductImage" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png">
        </label>
      `;

    return `
      <div class="product-form-content">
        <h3>${product ? '編輯商品' : '新增商品'}</h3>

        <section class="product-form-section">
          <h4><span></span>商品基本資料</h4>

          <div class="product-form-grid">
            <label>
              <span>商品名稱</span>
              <input
                id="stallProductName"
                type="text"
                maxlength="40"
                value="${name}"
                placeholder="請輸入商品名稱"
              >
            </label>

            <label>
              <span>商品價格</span>
              <div class="product-price-input">
                <input
                  id="stallProductPrice"
                  type="number"
                  min="1"
                  step="1"
                  value="${price}"
                  placeholder="請輸入價格"
                >
                <span>元</span>
              </div>
            </label>

            <label class="product-description-field">
              <span>商品簡介</span>
              <textarea
                id="stallProductDescription"
                maxlength="120"
                placeholder="請簡單介紹你的商品特色"
              >${description}</textarea>
            </label>
          </div>
        </section>

        <section class="product-form-section">
          <h4><span></span>商品圖片</h4>

          <div class="product-upload-row">
            ${imageControl}

            <div class="product-upload-guide">
              <strong id="stallProductImageName">
                ${product ? '目前使用原商品圖片' : '每個商品限上傳 1 張圖片'}
              </strong>
              <span>建議比例：4:3</span>
              <span>檔案格式：JPG / PNG</span>
              <span>檔案大小：最大 5MB</span>
               <label class="product-change-image" for="stallProductImage">
            更換圖片
            <input id="stallProductImage" type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png">
          </label>
            </div>
          </div>
        </section>

        <p id="stallProductError" class="product-form-error" role="alert"></p>
      </div>
    `;
  }

  /** 綁定檔案名稱提示，讓使用者確認目前選取的圖片。 */
  private bindProductImageName(): void {
    const imageInput = document.getElementById('stallProductImage') as HTMLInputElement | null;
    const imageName = document.getElementById('stallProductImageName');
    const imagePreview = document.getElementById('stallProductPreview') as HTMLImageElement | null;

    imageInput?.addEventListener('change', () => {
      const imageFile = imageInput.files?.[0];

      if (imageName) {
        imageName.textContent = imageFile?.name ?? '每個商品限上傳 1 張圖片';
      }

      if (imageFile && imagePreview) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          imagePreview.src = String(reader.result ?? '');
        });
        reader.readAsDataURL(imageFile);
      }

      this.showProductFormError('');
    });
  }

  /** 讀取並驗證彈窗欄位；回傳 false 時 SweetAlert 保持開啟。 */
  private readProductForm(existingImage = ''): StallProduct | false {
    const name = this.getProductInputValue('stallProductName');
    const description = this.getProductInputValue('stallProductDescription');
    const price = Number(this.getProductInputValue('stallProductPrice'));
    const imageInput = document.getElementById('stallProductImage') as HTMLInputElement | null;
    const imageFile = imageInput?.files?.[0];

    if (!name || !description || !price) {
      this.showProductFormError('請完整填寫商品名稱、價格與商品簡介。');
      return false;
    }

    if (price <= 0) {
      this.showProductFormError('商品價格必須大於 0 元。');
      return false;
    }

    if (!imageFile && !existingImage) {
      this.showProductFormError('請上傳 1 張商品圖片。');
      return false;
    }

    if (imageFile && !['image/jpeg', 'image/png'].includes(imageFile.type)) {
      this.showProductFormError('商品圖片僅支援 JPG 或 PNG 格式。');
      return false;
    }

    if (imageFile && imageFile.size > 5 * 1024 * 1024) {
      this.showProductFormError('商品圖片大小不可超過 5MB。');
      return false;
    }

    return {
      name,
      description,
      price,
      image: imageFile ? URL.createObjectURL(imageFile) : existingImage,
    };
  }

  private getProductInputValue(id: string): string {
    const field = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | null;
    return field?.value.trim() ?? '';
  }

  private showProductFormError(message: string): void {
    const errorElement = document.getElementById('stallProductError');

    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  /** 避免編輯或刪除瀏覽器暫存圖片時留下 object URL。 */
  private revokeObjectUrl(image: string): void {
    if (image.startsWith('blob:')) {
      URL.revokeObjectURL(image);
    }
  }

  /** 將既有商品資料安全放入 SweetAlert HTML。 */
  private escapeHtml(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }
}
