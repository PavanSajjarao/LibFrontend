import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports:[CommonModule , RouterLink],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to role changes
    this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
      console.log("Updated User Role:", this.userRole);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
