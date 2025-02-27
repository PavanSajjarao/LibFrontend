import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrService } from 'ngx-toastr';
import { BorrowService } from '../../../../services/borrow.service';
import { AuthService } from '../../../../services/auth.service';
import { DateFormatService } from '../../../../services/date-format.service';



@Component({
  selector: 'app-my-borrows',
  imports: [CommonModule, NgxPaginationModule], 
  templateUrl: './myborrows.component.html',
  styleUrls: ['./myborrows.component.css']
})
export class MyBorrowsComponent implements OnInit {
  borrowedBooks: any[] = [];
  userId: string | null = null;
  isLoading = false;
  isReturning = false;
  today = new Date();
  selectedFormat:string = 'MM/dd/yyyy';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(
    private borrowService: BorrowService,
    private authService: AuthService,
    private toastr: ToastrService,
    private dateFormatService: DateFormatService
  ) {}

  ngOnInit(): void {
    this.dateFormatService.dateFormat$.subscribe(format => {
      this.selectedFormat = format;
    });
    this.userId = this.authService.getUserId();
    
    if (!this.userId) {
      this.toastr.warning('Please log in to see borrowed books.', 'Warning');
      return;
    }

    this.fetchBorrowedBooks();
  }

  fetchBorrowedBooks(): void {
    if (!this.userId) return;

    this.isLoading = true;
    this.borrowService.getUserBorrowedBooks(this.userId).subscribe({
      next: (books) => {
        this.borrowedBooks = books;
        if (this.borrowedBooks.length === 0) {
          this.toastr.info('No borrowed books found.', 'Info');
        }
      },
      error: (err) => {
        console.error('Error fetching borrowed books:', err);
        this.toastr.error('Failed to load borrowed books. Please try again.', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  returnBook(bookId: string): void {
    if (!this.userId || this.isReturning) return;

    this.isReturning = true;

    this.borrowService.returnBook(this.userId, bookId).subscribe({
      next: () => {
        this.borrowedBooks = this.borrowedBooks.filter(book => book.bookId?._id !== bookId);
        this.toastr.success('Book returned successfully!', 'Success');
      },
      error: (err) => {
        console.error('Error returning book:', err);
        this.toastr.error('Failed to return book. Please try again.', 'Error');
      },
      complete: () => {
        this.isReturning = false;
      }
    });
  }
}
