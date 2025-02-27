import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DateFormatService } from '../../services/date-format.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports:[FormsModule , CommonModule , RouterLink , RouterLinkActive],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  userRole: string | null = null;
  selectedFormat: string = 'MM/dd/yyyy';

  constructor(
    private dateFormatService: DateFormatService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Subscribe to role changes from AuthService
    this.authService.userRole$.subscribe((role) => {
      this.userRole = role;
      console.log('Updated role:', this.userRole);
    });
  }

  updateDateFormat() {
    this.dateFormatService.setDateFormat(this.selectedFormat);
  }

  logout() {
    this.authService.logout();
  }
}
