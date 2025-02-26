import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
@Component({
  imports:[CommonModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLogoutVisible = false;
  userRole: string | null = null;

  constructor(public authService: AuthService, private router: Router , private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.userRole = this.authService. getSelectedUserRole();
    console.log("Current User Role:", this.userRole);
    this.cdRef.detectChanges();
  }

  toggleLogout() {
    this.isLogoutVisible = !this.isLogoutVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLogoutVisible = false;
  }
}
