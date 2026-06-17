import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-user-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss',
})
export class UserHeader {
  protected isMenuOpen = false;
  protected isBrandSection = false;
  protected isActivitySection = false;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    this.updateActiveSections(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.updateActiveSections(event.urlAfterRedirects);
        this.closeMenu();
      });
  }

  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  protected closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('document:keydown.escape')
  protected closeMenuOnEscape(): void {
    this.closeMenu();
  }

  private updateActiveSections(url: string): void {
    this.isBrandSection =
      url.startsWith('/user/brands') || url.startsWith('/user/brand-detail');
    this.isActivitySection =
      url.startsWith('/user/activity-list') || url.startsWith('/user/activity-detail');
  }
}
