import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

enum Role {
  User = 'user',
  Admin = 'admin',
  Moderator = 'moderator'
}

@Component({
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  selectedRole: string = ''; // Selected role from dropdown
  roles: string[] = [Role.User, Role.Admin, Role.Moderator]; // Hardcoded roles

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      selectedRole: ['', Validators.required], // Store the selected role
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    const { email, password, selectedRole } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        const token: any = jwtDecode(res.token);
        const availableRoles: string[] = token.role; // Extract roles from token

        if (availableRoles.includes(selectedRole)) {
          // Store token and selected role
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', selectedRole);

          this.redirectUser(selectedRole);
        } else {
          this.errorMessage = 'You do not have permission to access this role.';
        }
      },
      error: () => (this.errorMessage = 'Invalid email or password'),
    });
  }

  redirectUser(role: string) {
    const roleRoutes: { [key: string]: string } = {
      [Role.Admin]: '/admin-dashboard',
      [Role.Moderator]: '/moderator-dashboard',
      [Role.User]: '/user-dashboard',
    };

    this.router.navigate([roleRoutes[role] || '/user-dashboard']);
  }
}
