import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookService, Book } from '../../../../services/book.service';
import { BorrowService } from '../../../../services/borrow.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { DateFormatService } from '../../../../services/date-format.service';

interface JwtPayload {
  id: string;
  role: string[];
}

@Component({
  imports: [CommonModule, CurrencyPipe, DatePipe],
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  borrowedBooks: Set<string> = new Set(); // Stores IDs of borrowed books
  currentPage: number = 1;
  keyword: string = '';
  pageSize: number = 10;
  hasNextPage: boolean = false;
  isLoading: boolean = false;
  selectedFormat:string = 'MM/dd/yyyy';

  constructor(
    private bookService: BookService,
    private borrowService: BorrowService,
    private router: Router,
    private toastr: ToastrService,
    private dateFormatService: DateFormatService
  ) {}

  ngOnInit(): void {
    this.loadBooks();
    this.loadBorrowedBooks();
    this.dateFormatService.dateFormat$.subscribe(format => {
      this.selectedFormat = format;
    });
  }

  loadBooks(): void {
    this.isLoading = true;
    this.bookService.getBooks(this.currentPage, this.keyword).subscribe({
      next: (data) => {
        this.books = data || [];
        this.isLoading = false;

        // Check if there's a next page
        this.bookService.getBooks(this.currentPage + 1, this.keyword).subscribe({
          next: (nextData) => {
            this.hasNextPage = nextData && nextData.length > 0;
          },
          error: () => {
            this.hasNextPage = false;
          }
        });
      },
      error: (err) => {
        console.error('Error fetching books:', err);
        this.toastr.error('Failed to load books. Please try again.', 'Error');
        this.isLoading = false;
      }
    });
  }

  loadBorrowedBooks(): void {
    const userId = this.extractUserIdFromToken();
    if (!userId) return;
  
    this.borrowService.getUserBorrowedBooks(userId).subscribe({
      next: (borrowedBooks: { bookId: { _id: string } }[]) => { 
        this.borrowedBooks = new Set(borrowedBooks.map(b => b.bookId._id)); // Extract book _id
      },
      error: (err) => {
        console.error('Error fetching borrowed books:', err);
      }
    });
  }
  

  onNextPage(): void {
    if (this.hasNextPage) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  onPrevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  extractUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.id || null;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  onBorrow(book: any): void {
    const userId = this.extractUserIdFromToken();

    if (!userId) {
      this.toastr.warning('User not logged in. Please log in first.', 'Warning');
      return;
    }

    if (this.borrowedBooks.has(book._id)) {
      this.toastr.error('You have already borrowed this book.', 'Error');
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    this.borrowService.borrowBook(userId, book._id, dueDate.toISOString())
      .subscribe({
        next: () => {
          this.toastr.success(`Successfully borrowed ${book.title}. Due date: ${dueDate.toDateString()}`, 'Success');
          this.borrowedBooks.add(book._id); // Update borrowed books
        },
        error: (err) => {
          this.toastr.error('Borrow request failed. Try again later.', 'Error');
          console.error('Borrow error:', err);
        }
      });
  }
}
