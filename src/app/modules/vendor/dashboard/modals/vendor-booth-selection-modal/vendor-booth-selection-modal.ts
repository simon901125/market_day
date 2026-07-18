import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

export type VendorBoothSelectionDialog = 'confirm' | 'success' | 'conflict';

export interface VendorBoothSelectionDialogDay {
  date: string;
  booth: {
    code: string;
    zone: string;
  } | null;
}

@Component({
  selector: 'app-vendor-booth-selection-modal',
  templateUrl: './vendor-booth-selection-modal.html',
  styleUrl: './vendor-booth-selection-modal.scss',
})
export class VendorBoothSelectionModal implements OnDestroy {
  private dialogValue: VendorBoothSelectionDialog = 'confirm';

  @Input({ required: true })
  set dialog(value: VendorBoothSelectionDialog) {
    const changed = this.dialogValue !== value;
    this.dialogValue = value;
    if (changed) this.closing = false;
  }

  get dialog(): VendorBoothSelectionDialog { return this.dialogValue; }
  @Input({ required: true }) days: readonly VendorBoothSelectionDialogDay[] = [];
  /** API 送出期間鎖定確認按鈕，避免重複建立選位資料。 */
  @Input() submitting = false;

  @Output() closeDialog = new EventEmitter<void>();
  @Output() confirmSelection = new EventEmitter<void>();
  @Output() retrySelection = new EventEmitter<void>();
  @Output() returnToDetail = new EventEmitter<void>();

  closing = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  get title(): string {
    if (this.dialog === 'confirm') return '確認完成攤位選擇';
    if (this.dialog === 'success') return '已完成攤位選擇';
    return '您選擇的攤位已被選走';
  }

  requestClose(): void {
    this.closeWith(() => this.closeDialog.emit());
  }

  requestConfirm(): void {
    if (this.submitting) return;
    this.closeWith(() => this.confirmSelection.emit());
  }

  requestRetry(): void {
    this.closeWith(() => this.retrySelection.emit());
  }

  requestReturnToDetail(): void {
    this.closeWith(() => this.returnToDetail.emit());
  }

  ngOnDestroy(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }

  private closeWith(action: () => void): void {
    if (this.closing) return;
    this.closing = true;
    this.closeTimer = setTimeout(action, 150);
  }
}
