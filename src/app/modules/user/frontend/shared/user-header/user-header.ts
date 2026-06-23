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
/** 一般使用者前台 Header，負責桌機/手機導覽與目前區塊高亮。 */
export class UserHeader {
  /** 手機版選單是否展開。 */
  protected isMenuOpen = false;
  /** 目前路由是否位於品牌探索區。 */
  protected isBrandSection = false;
  /** 目前路由是否位於市集活動區。 */
  protected isActivitySection = false;
  private readonly destroyRef = inject(DestroyRef);

  /** 監聽路由變化，用於更新導覽 active 狀態並關閉手機選單。 */
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

  /** 切換手機版選單開關。 */
  protected toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /** 關閉手機版選單。 */
  protected closeMenu(): void {
    this.isMenuOpen = false;
  }

  /** 使用 Escape 快捷鍵關閉手機版選單。 */
  @HostListener('document:keydown.escape')
  protected closeMenuOnEscape(): void {
    this.closeMenu();
  }

  /** 根據目前 URL 判斷 Header 上哪個主選單需要高亮。 */
  private updateActiveSections(url: string): void {
    this.isBrandSection =
      url.startsWith('/user/brands') || url.startsWith('/user/brand-detail');
    this.isActivitySection =
      url.startsWith('/user/activity-list') || url.startsWith('/user/activity-detail');
  }
}
