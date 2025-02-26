import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles']; 
    const selectedRole: string | null = this.authService.getSelectedUserRole();

    if (!selectedRole || !expectedRoles.includes(selectedRole)) {
      this.router.navigate(['/forbidden']); // Redirect unauthorized users
      return false;
    }

    return true;
  }
}
