import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports:[ReactiveFormsModule , CommonModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls:['./signup.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [[]], // Optional array of roles
    });
  }

  signUp() {
    if (this.signUpForm.invalid) return;

    this.authService.signUp(this.signUpForm.value).subscribe({
      next: () => this.router.navigate(['/user-dashboard']),
      error: (err) => (this.errorMessage = 'Signup failed! Try again.'),
    });
  }
}
