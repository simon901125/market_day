import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, UrlTree, provideRouter } from '@angular/router';

import {
  getAuthTokenKey,
  getAuthUserKey,
} from '../core/auth/auth-storage.constants';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()],
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
    setLoginSession('ORGANIZER');

    const result = executeGuard({ data: { role: 'organizer' } } as any, {} as any);

    expect(result).toBeTrue();
  });

  it('should redirect to the requested role login when only another role is logged in', () => {
    setLoginSession('VENDOR');

    const result = executeGuard({ data: { role: 'admin' } } as any, {} as any) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/admin/login');
  });

  it('should keep role sessions independent', () => {
    setLoginSession('VENDOR');
    setLoginSession('ADMIN');

    const vendorResult = executeGuard({ data: { role: 'vendor' } } as any, {} as any);
    const adminResult = executeGuard({ data: { role: 'admin' } } as any, {} as any);

    expect(vendorResult).toBeTrue();
    expect(adminResult).toBeTrue();
  });

  it('should clear expired sessions and redirect to login', () => {
    setLoginSession('VENDOR', -60);

    const result = executeGuard({ data: { role: 'vendor' } } as any, {} as any) as UrlTree;

    expect(router.serializeUrl(result)).toBe('/vendor/login');
    expect(localStorage.getItem(getAuthTokenKey('vendor'))).toBeNull();
    expect(localStorage.getItem(getAuthUserKey('vendor'))).toBeNull();
  });

  function setLoginSession(
    role: 'VENDOR' | 'ORGANIZER' | 'ADMIN',
    expiresInSeconds = 3600
  ): void {
    const portalRole = role.toLowerCase() as 'vendor' | 'organizer' | 'admin';
    localStorage.setItem(
      getAuthTokenKey(portalRole),
      createJwt(Math.floor(Date.now() / 1000) + expiresInSeconds)
    );
    localStorage.setItem(
      getAuthUserKey(portalRole),
      JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        role,
        status: 'ACTIVE',
        isLogin: true,
      })
    );
  }

  function createJwt(exp: number): string {
    return [
      encodeBase64Url({ alg: 'HS256', typ: 'JWT' }),
      encodeBase64Url({ sub: 'test@example.com', exp }),
      'signature',
    ].join('.');
  }

  function encodeBase64Url(payload: object): string {
    return btoa(JSON.stringify(payload))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }
});
