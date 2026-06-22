import { Injectable } from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

export enum EnumSwalButton {
  Confirm = '確認',
  Cancel = '取消',
}

export type AlertStatus = 'success' | 'error' | 'warning' | 'info' | 'question';

@Injectable({
  providedIn: 'root',
})
export class Alert {
  /** 成功提示 */
  success(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('success', title, text, confirmButtonText);
  }

  /** 錯誤提示 */
  error(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('error', title, text, confirmButtonText);
  }

  /** 警告提示 */
  warning(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('warning', title, text, confirmButtonText);
  }

  /** 一般提示 */
  info(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('info', title, text, confirmButtonText);
  }

  /** 確認視窗 */
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

  /** 共用 Alert */
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

  /** 組合 HTML */
  private getHtml(status: AlertStatus, title: string, text = ''): string {
    return `
      <div class="custom-swal-icon ${status}">
        <i class="bi ${this.getIconClass(status)}"></i>
      </div>

      <h4 class="custom-swal-title">${title}</h4>

      ${text ? `<p class="custom-swal-text">${text}</p>` : ''}
    `;
  }

  /** Bootstrap Icon 對應 */
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

  /** SweetAlert2 class 對應 */
  private getCustomClass() {
    return {
      popup: 'custom-swal-popup',
      htmlContainer: 'custom-swal-html',
      actions: 'custom-swal-actions',
      closeButton: 'custom-swal-close',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
    };
  }
}
