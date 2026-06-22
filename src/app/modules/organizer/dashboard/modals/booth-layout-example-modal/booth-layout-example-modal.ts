import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-booth-layout-example-modal',
  imports: [],
  templateUrl: './booth-layout-example-modal.html',
  styleUrl: './booth-layout-example-modal.scss',
})
export class BoothLayoutExampleModal {
  @Output() closeDialog = new EventEmitter<void>();
}
