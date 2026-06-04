import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BrandItem } from '../../../models/BrandItem';

@Component({
  selector: 'app-user-brandserch-card',
  imports: [],
  templateUrl: './user-brandserch-card.html',
  styleUrl: './user-brandserch-card.scss',
})
export class UserBrandserchCard {
  @Input({ required: true }) brand!: BrandItem;
  @Output() cardClick = new EventEmitter<BrandItem>();

  onCardClick(): void {
    this.cardClick.emit(this.brand);
  }
}
