import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BoothZoneDraft } from '../../../../../models/interface/organizer/BoothZoneDraft';

@Component({
  selector: 'app-booth-zone-modal',
  imports: [FormsModule],
  templateUrl: './booth-zone-modal.html',
  styleUrl: './booth-zone-modal.scss',
})
export class BoothZoneModal {
  /** 分區名稱固定為 A 區至 Z 區，並直接作為攤位編號前綴。 */
  readonly zoneNameOptions = Array.from(
    { length: 26 },
    (_, index) => `${String.fromCharCode(65 + index)} 區`,
  );

  /** 目前正在新增或編輯的攤位分區暫存資料。 */
  @Input({ required: true }) draft!: BoothZoneDraft;

  /** 系統提供的快速色票清單。 */
  @Input() zoneColors: string[] = [];

  /** 既有分區名稱，用來避免使用者輸入重複名稱。 */
  @Input() existingZoneNames: string[] = [];

  /** 既有分區顏色，用來避免分區色彩重複造成辨識困難。 */
  @Input() existingZoneColors: string[] = [];

  /** 判斷目前 Modal 是新增模式還是編輯模式。 */
  @Input() editing = false;

  /** 父層準備關閉時套用退場動畫。 */
  @Input() closing = false;

  /** 通知父層關閉 Modal。 */
  @Output() closeDialog = new EventEmitter<void>();

  /** 表單驗證通過後，通知父層儲存分區。 */
  @Output() saveDialog = new EventEmitter<void>();

  /** 使用者選擇或輸入顏色時同步給父層。 */
  @Output() colorSelected = new EventEmitter<string>();

  /** 是否已嘗試送出，用來控制錯誤訊息顯示時機。 */
  submitted = false;

  /** 分區名稱為必填。 */
  get nameInvalid(): boolean {
    return !this.zoneNameOptions.includes(this.draft.name.trim());
  }

  /** 檢查分區名稱是否已經存在。 */
  get nameDuplicate(): boolean {
    const currentName = this.normalizeZoneName(this.draft.name);
    return Boolean(currentName) && this.existingZoneNames.some((name) => this.normalizeZoneName(name) === currentName);
  }

  /** 已被其他分區使用的名稱不再提供選擇。 */
  isZoneNameUsed(name: string): boolean {
    const normalizedName = this.normalizeZoneName(name);
    return this.existingZoneNames.some(
      (existingName) => this.normalizeZoneName(existingName) === normalizedName,
    );
  }

  /** 分區顏色為必填。 */
  get colorRequired(): boolean {
    return !this.draft.color.trim();
  }

  /** 分區顏色只接受 HEX 色碼。 */
  get colorFormatInvalid(): boolean {
    return !this.colorRequired && !/^#[0-9A-Fa-f]{6}$/.test(this.draft.color.trim());
  }

  /** 檢查分區顏色是否已被其他分區使用。 */
  get colorDuplicate(): boolean {
    const currentColor = this.draft.color.trim().toUpperCase();
    return (
      !this.colorRequired &&
      !this.colorFormatInvalid &&
      this.existingZoneColors.some((color) => color.trim().toUpperCase() === currentColor)
    );
  }

  /** 攤位數量需為大於 0 的整數。 */
  get countInvalid(): boolean {
    const count = Number(this.draft.count);
    return this.draft.count === null || !Number.isInteger(count) || count < 1;
  }

  /** 統一彙整整個 Modal 表單是否有錯誤。 */
  get formInvalid(): boolean {
    return (
      this.nameInvalid ||
      this.nameDuplicate ||
      this.colorRequired ||
      this.colorFormatInvalid ||
      this.colorDuplicate ||
      this.countInvalid
    );
  }

  /** 使用者手動輸入色碼時，自動補上 # 並同步給父層。 */
  onColorCodeChange(value: string): void {
    const normalized = value.trim();
    if (!normalized) {
      this.colorSelected.emit('');
      return;
    }

    this.colorSelected.emit(normalized.startsWith('#') ? normalized : `#${normalized}`);
  }

  /** 送出前先觸發驗證，通過後才交給父層儲存。 */
  onSave(): void {
    this.submitted = true;
    if (this.formInvalid) {
      return;
    }

    this.saveDialog.emit();
  }

  /** 移除使用者可能輸入的「區」尾字，讓重複檢查更準確。 */
  private normalizeZoneName(name: string): string {
    return name.trim().toUpperCase();
  }
}
