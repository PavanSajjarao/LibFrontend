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
  selectedRole: string = '';
  roles: string[] = [Role.User, Role.Admin, Role.Moderator];
  loading: boolean = false; // Track API request state

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      selectedRole: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true; // Start API request

    const { email, password, selectedRole } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: (res) => {
        const token: any = jwtDecode(res.token);
        const availableRoles: string[] = token.role;

        if (availableRoles.includes(selectedRole)) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', selectedRole);
          this.authService.setUserRole(selectedRole);
          this.redirectUser(selectedRole);
        } else {
          this.errorMessage = 'You do not have permission to access this role.';
        }
        this.loading = false; // Reset loading state
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
        this.loading = false; // Reset loading state
      },
    });
  }

  redirectUser(role: string) {
    const roleRoutes: { [key: string]: string } = {
      [Role.Admin]: '/admin-dashboard/books',
      [Role.Moderator]: '/moderator-dashboard',
      [Role.User]: '/home',
    };
    this.router.navigate([roleRoutes[role] || '/user-dashboard']);
  }
}
