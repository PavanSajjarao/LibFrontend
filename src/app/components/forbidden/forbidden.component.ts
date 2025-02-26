import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  imports:[RouterLink],
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.css'],
})
export class ForbiddenComponent {
  redirectLink: string = '/';
  redirectText: string = 'Go to Home';

  constructor(private authService: AuthService) {
    const userRole = this.authService.getSelectedUserRole(); // Get the logged-in user's role

    // Set the appropriate redirect link
    if (userRole === 'admin') {
      this.redirectLink = '/admin-dashboard';
      this.redirectText = 'Go to Admin Dashboard';
    } else if (userRole === 'moderator') {
      this.redirectLink = '/moderator-dashboard';
      this.redirectText = 'Go to Moderator Dashboard';
    } else if (userRole === 'user') {
      this.redirectLink = '/user-dashboard';
      this.redirectText = 'Go to Home';
    }
  }
}
