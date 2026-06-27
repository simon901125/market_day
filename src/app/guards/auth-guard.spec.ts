import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree, provideRouter } from '@angular/router';

import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });

    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect unauthenticated vendor users to vendor login', () => {
    const result = executeGuard({ data: { role: 'vendor' } } as any, {} as any) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/vendor/login');
  });

  it('should allow users with matched role', () => {
    sessionStorage.setItem('isLogin', 'true');
    sessionStorage.setItem('userRole', 'organizer');

    const result = executeGuard({ data: { role: 'organizer' } } as any, {} as any);

    expect(result).toBeTrue();
  });

  it('should redirect users with mismatched role to their own dashboard', () => {
    sessionStorage.setItem('isLogin', 'true');
    sessionStorage.setItem('userRole', 'vendor');

    const result = executeGuard({ data: { role: 'admin' } } as any, {} as any) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/vendor/dash-board/home');
  });
});
