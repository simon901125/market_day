import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

interface GoogleCredentialResponse {
  credential?: string;
}

interface GooglePromptMomentNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
  getNotDisplayedReason(): string;
  getSkippedReason(): string;
  getDismissedReason(): string;
}

interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }): void;
  prompt(callback?: (notification: GooglePromptMomentNotification) => void): void;
  cancel(): void;
}

interface GoogleIdentityApi {
  accounts: {
    id: GoogleAccountsId;
  };
}

declare global {
  interface Window {
    google?: GoogleIdentityApi;
  }
}

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private scriptLoading?: Promise<void>;

  getCredential(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!environment.googleClientId) {
        reject(new Error('尚未設定 Google Client ID。'));
        return;
      }

      this.loadScript()
        .then(() => {
          const google = window.google;
          if (!google) {
            reject(new Error('Google 登入服務載入失敗，請稍後再試。'));
            return;
          }

          google.accounts.id.initialize({
            client_id: environment.googleClientId,
            callback: (response) => {
              if (response.credential) {
                resolve(response.credential);
                return;
              }

              reject(new Error('未取得 Google 登入憑證，請重新操作。'));
            },
          });

          google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed()) {
              reject(
                new Error(
                  this.getPromptMessage(notification.getNotDisplayedReason())
                )
              );
              return;
            }

            if (notification.isSkippedMoment()) {
              reject(
                new Error(this.getPromptMessage(notification.getSkippedReason()))
              );
              return;
            }

            if (notification.isDismissedMoment()) {
              reject(
                new Error(
                  this.getPromptMessage(notification.getDismissedReason())
                )
              );
            }
          });
        })
        .catch(() => reject(new Error('Google 登入服務載入失敗，請稍後再試。')));
    });
  }

  getEmailFromCredential(credential: string): string | null {
    try {
      const payload = credential.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(normalizedPayload)
          .split('')
          .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
          .join('')
      );
      const parsed = JSON.parse(json) as { email?: string };
      return parsed.email ?? null;
    } catch {
      return null;
    }
  }

  private loadScript(): Promise<void> {
    if (window.google) {
      return Promise.resolve();
    }

    if (this.scriptLoading) {
      return this.scriptLoading;
    }

    this.scriptLoading = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });

    return this.scriptLoading;
  }

  private getPromptMessage(reason: string): string {
    if (reason === 'suppressed_by_user' || reason === 'user_cancel') {
      return '你已取消 Google 登入。';
    }

    return '目前無法開啟 Google 登入視窗，請確認瀏覽器設定後再試。';
  }
}
