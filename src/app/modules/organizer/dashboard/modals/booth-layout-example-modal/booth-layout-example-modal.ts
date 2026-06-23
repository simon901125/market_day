import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-booth-layout-example-modal',
  imports: [],
  templateUrl: './booth-layout-example-modal.html',
  styleUrl: './booth-layout-example-modal.scss',
})
/** 攤位配置圖範例 Modal，讓主辦方查看上傳配置圖的格式說明。 */
export class BoothLayoutExampleModal {
  /** 通知父層關閉範例 Modal。 */
  @Output() closeDialog = new EventEmitter<void>();
}
