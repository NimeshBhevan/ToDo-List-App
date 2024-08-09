import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private localstorage: LocalstorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = this.localstorage.getToken();
    console.log(token);
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));

      if (tokenDecode.userId && !this.tokenExpired(tokenDecode.exp))
        return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  private tokenExpired(exp: any) {
    return Math.floor(new Date().getTime() / 1000) >= exp;
  }
}
