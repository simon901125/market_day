import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

export enum EnumSwalButton {
  Confirm = '確定',
  Cancel = '取消',
}

export type AlertStatus = 'success' | 'error' | 'warning' | 'info' | 'question';

export interface AlertHtmlConfirmOptions {
  html: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  popupClass?: string;
  showCloseButton?: boolean;
}

export interface AlertHtmlOptions {
  html: string;
  confirmButtonText?: string;
  popupClass?: string;
  showCloseButton?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  success(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('success', title, text, confirmButtonText);
  }

  error(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('error', title, text, confirmButtonText);
  }

  warning(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('warning', title, text, confirmButtonText);
  }

  info(
    title: string,
    text = '',
    confirmButtonText: string = EnumSwalButton.Confirm
  ): Promise<SweetAlertResult> {
    return this.alert('info', title, text, confirmButtonText);
  }

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

  confirmHtml(options: AlertHtmlConfirmOptions): Promise<boolean> {
    return Swal.fire({
      html: options.html,
      showCancelButton: true,
      showCloseButton: options.showCloseButton ?? true,
      allowOutsideClick: false,
      confirmButtonText: options.confirmButtonText ?? EnumSwalButton.Confirm,
      cancelButtonText: options.cancelButtonText ?? EnumSwalButton.Cancel,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: this.getCustomClass(options.popupClass),
    }).then((result) => result.isConfirmed);
  }

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

  custom<T = unknown>(options: SweetAlertOptions): Promise<SweetAlertResult<T>> {
    const extraClass =
      typeof options.customClass === 'object' && !Array.isArray(options.customClass)
        ? options.customClass
        : {};
    const popupClass =
      typeof extraClass['popup'] === 'string'
        ? extraClass['popup']
        : '';

    return Swal.fire({
      showCloseButton: true,
      allowOutsideClick: false,
      buttonsStyling: false,
      ...options,
      customClass: {
        ...this.getCustomClass(popupClass),
        ...extraClass,
        popup: ['custom-swal-popup', popupClass].filter(Boolean).join(' '),
      },
    }) as Promise<SweetAlertResult<T>>;
  }

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

  private getHtml(status: AlertStatus, title: string, text = ''): string {
    return `
      <div class="custom-swal-icon ${status}">
        <i class="bi ${this.getIconClass(status)}"></i>
      </div>

      <h4 class="custom-swal-title">${title}</h4>

      ${text ? `<p class="custom-swal-text">${text}</p>` : ''}
    `;
  }

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
