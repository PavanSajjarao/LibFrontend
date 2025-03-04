import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false; // Prevents multiple submissions

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signUpForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: [[]], // Optional array of roles
    });
  }

  signUp() {
    if (this.signUpForm.invalid || this.isSubmitting) return;
  
    this.isSubmitting = true;
    this.errorMessage = ''; // Clear previous errors
  
    this.authService.signUp(this.signUpForm.value).subscribe({
      next: () => {
        this.router.navigate(['/home']); //  No need to store token here; it's already handled in AuthService
        this.isSubmitting = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;
  
        if (error.status === 409) {
          this.errorMessage = 'User already registered. Please log in.';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid request. Check your details.';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Signup failed! Try again.';
        }
      },
    });
  }
  

  hasError(controlName: string): boolean {
    const control = this.signUpForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }
}
