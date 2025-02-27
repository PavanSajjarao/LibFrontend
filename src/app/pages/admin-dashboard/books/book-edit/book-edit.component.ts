import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BookService, Book } from '../../../../services/book.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css']
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  errorMessage: string = '';
  coverImageError: string = '';
  imageUrl: string = '';
  uploadProgress: number = -1;

  // The ID of the book being edited
  private bookId: string = '';

  // Cloudinary configuration (from environment)
  private readonly cloudName = environment.cloudinary.cloudName;
  private readonly uploadPreset = environment.cloudinary.uploadPreset;
  private readonly cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private bookService: BookService,
    private http: HttpClient
  ) {
    // Initialize the form with validations
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      price: [null, [Validators.required, Validators.pattern('^[0-9]+(\\.[0-9]{1,2})?$')]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Retrieve the book ID from the route parameters
    this.bookId = this.route.snapshot.paramMap.get('id') || '';

    // Fetch existing book data from the backend using getBookById
    this.bookService.getBookById(this.bookId).subscribe({
      next: (book: Book) => {
        // Populate the form with existing values
        this.bookForm.patchValue({
          title: book.title,
          description: book.description,
          author: book.author,
          price: book.price,
          category: book.category
        });
        // Keep track of the existing image URL
        this.imageUrl = book.imageUrl;
      },
      error: (err: Error) => {
        console.error('Error fetching book data:', err);
        this.errorMessage = 'Failed to load book data. Please try again.';
      }
    });
  }

  // Handle file selection and upload to Cloudinary
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

    // Clear previous errors
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
      }
    });
  }

  // Submit the updated book data
  onSubmit(): void {
    if (this.bookForm.invalid) return;

    // Get form values and convert price to a number
    const formValue = this.bookForm.value;
    const updatedBookData: Partial<Book> = {
      ...formValue,
      price: Number(formValue.price),
      imageUrl: this.imageUrl
    };

    // Call updateBook with both bookId and updatedBookData
    this.bookService.updateBook(this.bookId, updatedBookData).subscribe({
      next: () => {
        // Navigate back to the list or show success message
        this.router.navigate(['/admin-dashboard/books']);
      },
      error: (err) => {
        console.error('Error updating book:', err);
        this.errorMessage = 'Error updating book. Please try again.';
      }
    });
  }

  onCancel(): void {
    if (this.bookForm.dirty && !confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      return;
    }
    this.router.navigate(['/admin-dashboard/books']);
  }
}
