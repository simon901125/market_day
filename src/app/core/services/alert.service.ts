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
  allowOutsideClick?: boolean;
}

export interface AlertHtmlOptions {
  html: string;
  confirmButtonText?: string;
  popupClass?: string;
  showCloseButton?: boolean;
}

export interface AlertSummaryItem {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

export interface AlertRequiredReasonOptions {
  title: string;
  description: string;
  fieldLabel: string;
  placeholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  maxLength?: number;
  summaryItems?: AlertSummaryItem[];
}

export interface AlertReasonConfirmationOptions {
  title: string;
  description: string;
  subjectLabel: string;
  subject: string;
  reasonLabel: string;
  reason: string;
  noticeTitle?: string;
  noticeItems?: string[];
  summaryItems?: AlertSummaryItem[];
  allowOutsideClick?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export interface AlertNoticeConfirmationOptions {
  title: string;
  description: string;
  noticeTitle?: string;
  noticeItems: string[];
  icon?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  allowOutsideClick?: boolean;
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
      allowOutsideClick: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: this.getCustomClass('', 'double'),
    }).then((result) => result.isConfirmed);
  }

  confirmHtml(options: AlertHtmlConfirmOptions): Promise<boolean> {
    return Swal.fire({
      html: options.html,
      showCancelButton: true,
      showCloseButton: options.showCloseButton ?? true,
      allowOutsideClick: options.allowOutsideClick ?? true,
      confirmButtonText: options.confirmButtonText ?? EnumSwalButton.Confirm,
      cancelButtonText: options.cancelButtonText ?? EnumSwalButton.Cancel,
      reverseButtons: true,
      buttonsStyling: false,
      customClass: this.getCustomClass(options.popupClass, 'double'),
    }).then((result) => result.isConfirmed);
  }

  successHtml(options: AlertHtmlOptions): Promise<SweetAlertResult> {
    return Swal.fire({
      html: options.html,
      showCloseButton: options.showCloseButton ?? true,
      allowOutsideClick: true,
      confirmButtonText: options.confirmButtonText ?? EnumSwalButton.Confirm,
      buttonsStyling: false,
      customClass: this.getCustomClass(options.popupClass, 'single'),
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
    const actionLayout = options.showCancelButton === true ? 'double' : 'single';
    const baseClass = this.getCustomClass(popupClass, actionLayout);

    return Swal.fire({
      showCloseButton: true,
      buttonsStyling: false,
      ...options,
      allowOutsideClick: true,
      customClass: {
        ...baseClass,
        ...extraClass,
        popup: baseClass.popup,
      },
    }) as Promise<SweetAlertResult<T>>;
  }

  requiredReason(options: AlertRequiredReasonOptions): Promise<string | null> {
    const maxLength = options.maxLength ?? 300;
    const summaryHtml = this.getSummarySectionHtml(options.summaryItems);

    return this.custom<string>({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="registration-swal-icon warning">
              <i class="bi bi-exclamation-lg"></i>
            </div>
            <h3>${this.escapeHtml(options.title)}</h3>
            <p class="registration-swal-main">${this.escapeHtml(options.description)}</p>
          </div>
          ${summaryHtml}
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
    const summaryRowsHtml = this.getSummaryRowsHtml(options.summaryItems);
    const noticeHtml = options.noticeItems?.length
      ? `
          <section class="refund-confirm-notice">
            <h4><i class="bi bi-info-circle"></i>${this.escapeHtml(options.noticeTitle ?? '注意事項')}</h4>
            <ul>
              ${options.noticeItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}
            </ul>
          </section>
        `
      : '';

    return this.confirmHtml({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="registration-swal-icon warning">
              <i class="bi bi-exclamation-lg"></i>
            </div>
            <h3>${this.escapeHtml(options.title)}</h3>
            <p class="registration-swal-main">${this.escapeHtml(options.description)}</p>
          </div>
          <div class="admin-swal-unpublish-form-data-section">
            ${summaryRowsHtml}
            <div class="admin-swal-unpublish-form-data">
              <span>${this.escapeHtml(options.subjectLabel)}</span>
              <span>${this.escapeHtml(options.subject)}</span>
            </div>
            <div class="admin-swal-unpublish-form-reason">
              <span>${this.escapeHtml(options.reasonLabel)}</span>
              <div>${this.escapeHtml(options.reason)}</div>
            </div>
          </div>
          ${noticeHtml}
        </div>
      `,
      confirmButtonText: options.confirmButtonText ?? '確認送出',
      cancelButtonText: options.cancelButtonText ?? '取消',
      popupClass: 'require-supplement-swal unpublish-request-swal',
      allowOutsideClick: options.allowOutsideClick,
    });
  }

  /** 共用的「警示說明＋注意事項清單」確認視窗。 */
  confirmNotice(options: AlertNoticeConfirmationOptions): Promise<boolean> {
    return this.confirmHtml({
      html: `
        <div class="registration-swal-content">
          <div class="supplement-swal-header">
            <div class="registration-swal-icon warning">
              <i class="bi ${this.escapeHtml(options.icon ?? 'bi-exclamation-lg')}"></i>
            </div>
            <h3>${this.escapeHtml(options.title)}</h3>
            <p class="registration-swal-main">${this.escapeHtml(options.description)}</p>
          </div>
          <section class="refund-confirm-notice">
            <h4><i class="bi bi-exclamation-circle"></i>${this.escapeHtml(options.noticeTitle ?? '注意事項')}</h4>
            <ul>${options.noticeItems.map((item) => `<li>${this.escapeHtml(item)}</li>`).join('')}</ul>
          </section>
        </div>
      `,
      confirmButtonText: options.confirmButtonText ?? '確認',
      cancelButtonText: options.cancelButtonText ?? '取消',
      popupClass: 'require-supplement-swal unpublish-request-swal',
      allowOutsideClick: options.allowOutsideClick,
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
      allowOutsideClick: true,
      confirmButtonText,
      buttonsStyling: false,
      customClass: this.getCustomClass('', 'single'),
    });
  }

  private getHtml(status: AlertStatus, title: string, text = ''): string {
    return `
      <div class="registration-swal-content">
        <div class="supplement-swal-header">
          <div class="registration-swal-icon ${status}">
            <i class="bi ${this.getIconClass(status)}"></i>
          </div>
          <h3>${this.escapeHtml(title)}</h3>
          ${text ? `<p class="registration-swal-main">${this.formatMessageText(text)}</p>` : ''}
        </div>
      </div>
    `;
  }

  private getIconClass(status: AlertStatus): string {
    const iconMap: Record<AlertStatus, string> = {
      success: 'bi-check-lg',
      error: 'bi-x-lg',
      warning: 'bi-exclamation-lg',
      info: 'bi-info-lg',
      question: 'bi-question-lg',
    };

    return iconMap[status];
  }

  private getSummarySectionHtml(items?: AlertSummaryItem[]): string {
    if (!items?.length) {
      return '';
    }

    return `<div class="admin-swal-unpublish-form-data-section alert-summary-section">${this.getSummaryRowsHtml(items)}</div>`;
  }

  private getSummaryRowsHtml(items?: AlertSummaryItem[]): string {
    return (items ?? []).map((item) => `
      <div class="admin-swal-unpublish-form-data alert-summary-row">
        <span>${this.escapeHtml(item.label)}</span>
        <span class="alert-summary-value${item.highlight ? ' highlight' : ''}">
          <strong>${this.escapeHtml(item.value)}</strong>
          ${item.note ? `<small>${this.escapeHtml(item.note)}</small>` : ''}
        </span>
      </div>
    `).join('');
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

  /** 一般訊息只允許既有的換行標記，其餘 HTML 一律跳脫。 */
  private formatMessageText(value: string): string {
    return this.escapeHtml(value).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
  }

  private getCustomClass(popupClass = '', actionLayout: 'single' | 'double' = 'single') {
    return {
      popup: [
        'custom-swal-popup',
        `${actionLayout}-action-swal`,
        popupClass,
      ].filter(Boolean).join(' '),
      htmlContainer: 'custom-swal-html',
      actions: 'custom-swal-actions',
      closeButton: 'custom-swal-close',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
    };
  }

}
