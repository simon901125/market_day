import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-user-brandserch-tag',
  imports: [],
  templateUrl: './user-brandserch-tag.html',
  styleUrl: './user-brandserch-tag.scss',
})
export class UserBrandserchTag {
  @Input() label: string = '';
  @Input() active: boolean = false;
  @Output() tagClick = new EventEmitter<void>();
}
