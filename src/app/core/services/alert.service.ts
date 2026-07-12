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

export interface AlertRequiredReasonOptions {
  title: string;
  description: string;
  fieldLabel: string;
  placeholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  maxLength?: number;
}

export interface AlertReasonConfirmationOptions {
  title: string;
  description: string;
  subjectLabel: string;
  subject: string;
  reasonLabel: string;
  reason: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
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

  requiredReason(options: AlertRequiredReasonOptions): Promise<string | null> {
    const maxLength = options.maxLength ?? 300;

    return this.custom<string>({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="restore-confirm-icon">
              <i class="bi bi-exclamation-circle"></i>
            </div>
            <h3>${this.escapeHtml(options.title)}</h3>
            <p class="registration-swal-main">${this.escapeHtml(options.description)}</p>
          </div>
          <label class="registration-swal-field required-reason-field">
            <span>${this.escapeHtml(options.fieldLabel)} <b>*</b></span>
            <span class="required-reason-control">
              <textarea
                id="requiredReason"
                class="supplement-swal-textarea"
                maxlength="${maxLength}"
                placeholder="${this.escapeHtml(options.placeholder ?? '請輸入原因')}"
              ></textarea>
              <em class="supplement-swal-counter" id="requiredReasonCount">0/${maxLength}</em>
            </span>
          </label>
          <p class="registration-swal-field-error" id="requiredReasonError" aria-live="polite"></p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? '下一步',
      cancelButtonText: options.cancelButtonText ?? '取消',
      reverseButtons: true,
      customClass: { popup: 'require-supplement-swal unpublish-request-swal' },
      didOpen: () => {
        const textarea = document.getElementById('requiredReason') as HTMLTextAreaElement | null;
        const counter = document.getElementById('requiredReasonCount');
        const error = document.getElementById('requiredReasonError');

        textarea?.focus();
        textarea?.addEventListener('input', () => {
          if (counter) counter.textContent = `${textarea.value.length}/${maxLength}`;
          if (error) error.textContent = '';
          textarea.classList.remove('is-invalid');
        });
      },
      preConfirm: () => {
        const textarea = document.getElementById('requiredReason') as HTMLTextAreaElement | null;
        const error = document.getElementById('requiredReasonError');
        const reason = textarea?.value.trim() ?? '';

        if (!reason) {
          if (error) error.textContent = `請填寫${options.fieldLabel}`;
          textarea?.classList.add('is-invalid');
          textarea?.focus();
          return false;
        }

        return reason;
      },
    }).then((result) => result.isConfirmed ? result.value ?? null : null);
  }

  confirmReason(options: AlertReasonConfirmationOptions): Promise<boolean> {
    return this.confirmHtml({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="restore-confirm-icon">
              <i class="bi bi-exclamation-circle"></i>
            </div>
            <h3>${this.escapeHtml(options.title)}</h3>
            <p class="registration-swal-main">${this.escapeHtml(options.description)}</p>
          </div>
          <div class="admin-swal-unpublish-form-data-section">
            <div class="admin-swal-unpublish-form-data">
              <span>${this.escapeHtml(options.subjectLabel)}</span>
              <span>${this.escapeHtml(options.subject)}</span>
            </div>
            <div class="admin-swal-unpublish-form-reason">
              <span>${this.escapeHtml(options.reasonLabel)}</span>
              <div>${this.escapeHtml(options.reason)}</div>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: options.confirmButtonText ?? '確認送出',
      cancelButtonText: options.cancelButtonText ?? '取消',
      popupClass: 'require-supplement-swal unpublish-request-swal',
    });
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

  private escapeHtml(value: string): string {
    return value.replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    })[character] ?? character);
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
