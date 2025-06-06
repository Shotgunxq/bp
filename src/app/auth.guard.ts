import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from './services/api.services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = this.apiService.getUserFromStorage();

    // 1) Not logged in → redirect to /login
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2) If route requires a specific role, check it
    const expectedRole = route.data['expectedRole'];
    if (expectedRole && user.role !== expectedRole) {
      // Logged in but not the right role → send back to /menu
      this.router.navigate(['/menu']);
      return false;
    }

    // 3) OK to activate
    return true;
  }
}
