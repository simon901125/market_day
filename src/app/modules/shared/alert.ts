import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

export enum EnumSwalButton {
  Confirm = '確定',
  Cancel = '取消',
}

export type AlertStatus = 'success' | 'error' | 'warning' | 'info' | 'question';

/** 客製確認視窗設定，供需要較複雜內容版型的情境使用。 */
export interface AlertHtmlConfirmOptions {
  /** 視窗內容 HTML。 */
  html: string;

  /** 確認按鈕文字。 */
  confirmButtonText?: string;

  /** 取消按鈕文字。 */
  cancelButtonText?: string;

  /** 額外套用在 SweetAlert popup 的 class。 */
  popupClass?: string;
}

/** 客製提示視窗設定，供成功送出等需要自訂內容版型的情境使用。 */
export interface AlertHtmlOptions {
  /** 視窗內容 HTML。 */
  html: string;

  /** 確認按鈕文字。 */
  confirmButtonText?: string;

  /** 額外套用在 SweetAlert popup 的 class。 */
  popupClass?: string;

  /** 是否顯示右上角關閉按鈕。 */
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class Alert {
  /** 顯示成功提示。 */
  success(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('success', title, text, confirmButtonText);
  }

  /** 顯示錯誤提示。 */
  error(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('error', title, text, confirmButtonText);
  }

  /** 顯示警告提示。 */
  warning(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('warning', title, text, confirmButtonText);
  }

  /** 顯示一般資訊提示。 */
  info(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('info', title, text, confirmButtonText);
  }

  /** 顯示確認提示，回傳使用者是否按下確認。 */
  confirm(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm,
    cancelButtonText: string = EnumSwalButton.Cancel
  ): Promise<boolean> {
    return Swal.fire({
      html: this.getHtml('warning', title, text),
      showCancelButton: true,
      showCloseButton: true,
      allowOutsideClick: false,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: this.getCustomClass(),
    }).then((result) => result.isConfirmed);
  }

  /** 顯示客製 HTML 確認視窗，元件仍透過 Alert service 使用 SweetAlert。 */
  confirmHtml(options: AlertHtmlConfirmOptions): Promise<boolean> {
    return Swal.fire({
      html: options.html,
      showCancelButton: true,
      showCloseButton: true,
      allowOutsideClick: false,
      confirmButtonText: options.confirmButtonText ?? EnumSwalButton.Confirm,
      cancelButtonText: options.cancelButtonText ?? EnumSwalButton.Cancel,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: this.getCustomClass(options.popupClass),
    }).then((result) => result.isConfirmed);
  }

  /** 顯示客製 HTML 提示視窗，仍沿用共用 SweetAlert 設定與按鈕樣式。 */
  successHtml(options: AlertHtmlOptions): Promise<SweetAlertResult> {
    return Swal.fire({
      html: options.html,
      showCloseButton: options.showCloseButton ?? false,
      allowOutsideClick: false,
      confirmButtonText: options.confirmButtonText ?? EnumSwalButton.Confirm,
      buttonsStyling: false,
      customClass: this.getCustomClass(options.popupClass),
    });
  }

  /** 共用 SweetAlert2 設定。 */
  private alert(
    status: AlertStatus,
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      html: this.getHtml(status, title, text),
      showCloseButton: true,
      allowOutsideClick: false,
      confirmButtonText,
      buttonsStyling: false,
      customClass: this.getCustomClass(),
    });
  }

  /** 組合 SweetAlert 內容 HTML。 */
  private getHtml(status: AlertStatus, title: string, text = ''): string {
    return `
      <div class="custom-swal-icon ${status}">
        <i class="bi ${this.getIconClass(status)}"></i>
      </div>

      <h4 class="custom-swal-title">${title}</h4>

      ${text ? `<p class="custom-swal-text">${text}</p>` : ''}
    `;
  }

  /** 依狀態取得 Bootstrap Icon。 */
  private getIconClass(status: AlertStatus): string {
    const iconMap: Record<AlertStatus, string> = {
      success: 'bi-check-circle',
      error: 'bi-x-circle',
      warning: 'bi-exclamation-circle',
      info: 'bi-info-circle',
      question: 'bi-question-circle',
    };

    return iconMap[status];
  }

  /** SweetAlert2 自訂 class。 */
  private getCustomClass(popupClass = '') {
    return {
      popup: ['custom-swal-popup', popupClass].filter(Boolean).join(' '),
      htmlContainer: 'custom-swal-html',
      actions: 'custom-swal-actions',
      closeButton: 'custom-swal-close',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
    };
  }
}
