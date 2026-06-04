import { Component, Input } from '@angular/core';
import { BrandItem } from '../../../models/BrandItem';

@Component({
  selector: 'app-user-brandserch-card',
  imports: [],
  templateUrl: './user-brandserch-card.html',
  styleUrl: './user-brandserch-card.scss',
})
export class UserBrandserchCard {
  @Input({ required: true }) brand!: BrandItem;
}
