import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../../../services/book.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.css']
})
export class BookAddComponent {
  bookForm: FormGroup;
  errorMessage: string = '';
  coverImageError: string = '';
  imageUrl: string = '';
  uploadProgress: number = -1;

  // Cloudinary configuration from environment
  private readonly cloudName = environment.cloudinary.cloudName; // e.g., dqvabhheb
  private readonly uploadPreset = environment.cloudinary.uploadPreset; // e.g., lms_unsigned
  private readonly cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private http: HttpClient
  ) {
    // Build the reactive form with validations. Note that we set price to null by default.
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      price: [null, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      category: ['', Validators.required]
    });
  }

  // Handle file selection with validations
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) {
      this.coverImageError = 'No file selected.';
      return;
    }

    // Validate file type: allow only PNG, JPEG, and JPG
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.coverImageError = 'Only PNG, JPEG, and JPG files are allowed.';
      return;
    }

    // Validate file size (limit to 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      this.coverImageError = 'File size should not exceed 5MB.';
      return;
    }

    // Clear any previous file errors
    this.coverImageError = '';

    // Prepare the FormData for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    // Upload the image to Cloudinary with progress tracking
    this.http.post<any>(this.cloudinaryUrl, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((event.loaded / event.total) * 100);
        } else if (event.type === HttpEventType.Response) {
          // Retrieve the secure URL from Cloudinary's response
          this.imageUrl = event.body.secure_url;
          this.uploadProgress = -1;
        }
      },
      error: (error) => {
        console.error('Error uploading image:', error);
        this.coverImageError = 'Image upload failed. Please try again.';
      },
      complete: () => {
        // Optionally handle completion if needed
      }
    });
  }

  // Submit the form data along with the Cloudinary image URL
  onSubmit(): void {
    if (this.bookForm.invalid || !this.imageUrl) return;

    // Convert the price field to a number before sending
    const formValue = this.bookForm.value;
    const bookData = {
      ...formValue,
      price: Number(formValue.price),
      imageUrl: this.imageUrl
    };

    console.log(bookData);

    this.bookService.createBook(bookData).subscribe({
      next: () => this.router.navigate(['/admin-dashboard/books']),
      error: err => {
        console.error('Error adding book:', err);
        this.errorMessage = 'Error adding book. Please try again.';
      }
    });
  }
}
