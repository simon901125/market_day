import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

/** Makes a management-table row behave like an accessible detail link. */
@Directive({
  selector: 'tr[appTableRowLink]',
  standalone: true,
})
export class ClickableTableRowDirective {
  @Input({ required: true }) appTableRowLink: string | any[] = [];
  @Input() appTableRowNavigationExtras: NavigationExtras = {};

  @HostBinding('class.app-clickable-table-row') readonly clickableClass = true;
  @HostBinding('attr.tabindex') readonly tabIndex = 0;
  @HostBinding('attr.role') readonly role = 'link';

  constructor(private readonly router: Router) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.isInteractiveTarget(event)) return;
    this.navigate();
  }

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: Event): void {
    if (this.isInteractiveTarget(event)) return;
    event.preventDefault();
    this.navigate();
  }

  private navigate(): void {
    const commands = Array.isArray(this.appTableRowLink) ? this.appTableRowLink : [this.appTableRowLink];
    if (commands.length === 0 || commands.every((command) => command === null || command === undefined || command === '')) return;
    void this.router.navigate(commands, this.appTableRowNavigationExtras);
  }

  private isInteractiveTarget(event: Event): boolean {
    if (!(event.target instanceof Element)) return false;
    const interactiveElement = event.target.closest('button, a, input, select, textarea, [role="button"], [role="link"]');
    return interactiveElement !== null && interactiveElement !== event.currentTarget;
  }
}
