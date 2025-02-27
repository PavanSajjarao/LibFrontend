import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DateFormatService } from '../../services/date-format.service';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
@Component({
  imports:[CommonModule , RouterLink ,FormsModule],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  userRole: string | null;
  selectedFormat:string = 'MM/dd/yyyy';
  constructor(
    private dateFormatService: DateFormatService,
    public authService: AuthService

  ) {
  
    this.userRole = localStorage.getItem('role'); // Assuming userRole is stored in localStorage
  }
updateDateFormat() {
    this.dateFormatService.setDateFormat(this.selectedFormat);
  }


  logout() {
    this.authService.logout();
  }
}

