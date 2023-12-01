import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, filter, map } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;

  return authService.isLoggedIn.pipe(
    map((isLoggedIn: boolean) => {
      if (isLoggedIn) {
        return true;
      }
      return router.parseUrl('/users/login');
    })
  )
};
