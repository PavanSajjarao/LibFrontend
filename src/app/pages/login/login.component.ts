import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  imports:[ReactiveFormsModule , CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
   
    if (this.loginForm.invalid) return;
  
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        const token: any = jwtDecode(res.token);
        console.log(token);
        this.redirectUser(token.role);
      },
      error: () => (this.errorMessage = 'Invalid email or password'),
    });
  }

  redirectUser(roles: string[]) {
    if (roles.includes('admin')) {
      this.router.navigate(['/admin-dashboard']);
    } else if (roles.includes('moderator')) {
      this.router.navigate(['/moderator-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
  
}
