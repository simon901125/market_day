import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-organizer-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './organizer-header.html',
  styleUrl: './organizer-header.scss',
})
export class OrganizerHeader {
  /** 手機版選單是否展開。 */
  isMenuOpen = false;

  /** 綁定元件生命週期，避免 Router 事件訂閱造成記憶體洩漏。 */
  private readonly destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    // 路由切換後自動收合選單，避免頁面已切換但選單仍停留在開啟狀態。
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.closeMenu());
  }

  /** 切換手機版選單開合狀態。 */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** 關閉手機版選單。 */
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  /** 使用者按下 Escape 時關閉選單。 */
  @HostListener('document:keydown.escape')
  closeMenuOnEscape(): void {
    this.closeMenu();
  }
}
