import { DOCUMENT } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingService } from './core/services/loading.service';
import { LoadingSpinner } from './modules/shared/loading-spinner/loading-spinner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly title = signal('market_day');

  constructor(protected readonly loadingService: LoadingService) {
    effect(() => {
      const isLoading = this.loadingService.isLoading();

      this.document.documentElement.classList.toggle('market-loading-lock', isLoading);
      this.document.body.classList.toggle('market-loading-lock', isLoading);
    });
  }
}
