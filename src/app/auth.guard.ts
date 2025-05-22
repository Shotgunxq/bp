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
    // Retrieve the logged-in user from storage
    const user = this.apiService.getUserFromStorage();

    if (!user) {
      // Redirect to login if not authenticated
      this.router.navigate(['/']);
      return false;
    }

    // Check for role restrictions using the 'expectedEmployeeType' key from route data.
    const expectedEmployeeType = route.data['expectedEmployeeType'];
    if (expectedEmployeeType && user.employeeType !== expectedEmployeeType) {
      // If the user does not match the expected type, redirect them (e.g., to the menu page)
      this.router.navigate(['/menu']);
      return false;
    }

    return true;
  }
}
