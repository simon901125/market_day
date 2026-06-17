import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BrandItem } from '../../../../../models/BrandItem';

@Component({
  selector: 'app-user-brandserch-card',
  imports: [],
  templateUrl: './user-brand-search-card.html',
  styleUrl: './user-brand-search-card.scss',
})
export class UserBrandSearchCard {
  @Input({ required: true }) brand!: BrandItem;
  @Output() cardClick = new EventEmitter<BrandItem>();

  get representativeProducts(): string {
    return this.brand.products.map((product) => product.name).join('、');
  }

  onCardClick(): void {
    this.cardClick.emit(this.brand);
  }
}
