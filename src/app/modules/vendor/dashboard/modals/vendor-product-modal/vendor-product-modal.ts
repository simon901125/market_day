import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface VendorProduct {
  id?: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-vendor-product-modal',
  imports: [FormsModule],
  templateUrl: './vendor-product-modal.html',
  styleUrl: './vendor-product-modal.scss',
})
export class VendorProductModal implements OnInit {
  @Input() product: VendorProduct | null = null;
  @Output() closeDialog = new EventEmitter<void>();
  @Output() saveProduct = new EventEmitter<VendorProduct>();

  draft: VendorProduct = { name: '', description: '', price: 0, image: '' };
  imageFile: File | null = null;
  imagePreview = '';
  imageName = '每個商品限上傳 1 張圖片';
  errorMessage = '';
  invalidFields = new Set<'name' | 'description' | 'price' | 'image'>();

  get editing(): boolean { return this.product !== null; }

  ngOnInit(): void {
    if (!this.product) return;
    this.draft = { ...this.product };
    this.imagePreview = this.product.image;
    this.imageName = '目前使用原商品圖片';
  }

  selectImage(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    this.imageFile = file;
    this.imageName = file.name;
    this.invalidFields.delete('image');
    this.errorMessage = '';

    const reader = new FileReader();
    reader.addEventListener('load', () => this.imagePreview = String(reader.result ?? ''));
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imageFile = null;
    this.imagePreview = '';
    this.draft.image = '';
    this.imageName = '尚未選擇圖片';
  }

  clearInvalid(field: 'name' | 'description' | 'price'): void {
    this.invalidFields.delete(field);
    this.errorMessage = '';
  }

  save(): void {
    this.invalidFields.clear();
    const name = this.draft.name.trim();
    const description = this.draft.description.trim();

    if (!name) this.invalidFields.add('name');
    if (!description) this.invalidFields.add('description');
    if (!this.draft.price || this.draft.price <= 0) this.invalidFields.add('price');
    if (!this.imageFile && !this.draft.image) this.invalidFields.add('image');

    if (this.invalidFields.size) {
      this.errorMessage = '請完整填寫商品名稱、價格、商品簡介並上傳圖片。';
      return;
    }

    if (this.imageFile && !['image/jpeg', 'image/png'].includes(this.imageFile.type)) {
      this.invalidFields.add('image');
      this.errorMessage = '商品圖片僅支援 JPG 或 PNG 格式。';
      return;
    }

    if (this.imageFile && this.imageFile.size > 5 * 1024 * 1024) {
      this.invalidFields.add('image');
      this.errorMessage = '商品圖片大小不可超過 5MB。';
      return;
    }

    this.saveProduct.emit({
      name,
      description,
      price: this.draft.price,
      image: this.imageFile ? URL.createObjectURL(this.imageFile) : this.draft.image,
    });
  }
}
