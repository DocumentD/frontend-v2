import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthorizationService } from '../service/authorization.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    public authorizationService: AuthorizationService,
    public router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot) {
    if (!this.authorizationService.isLoggedIn()) {
      await this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
