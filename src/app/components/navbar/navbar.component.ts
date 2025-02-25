import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, RouterLink , RouterLinkActive],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLogoutVisible = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleLogout() {
    this.isLogoutVisible = !this.isLogoutVisible;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.isLogoutVisible = false;
  }
}
