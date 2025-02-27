import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookService, Book } from '../../../../services/book.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  imports:[CommonModule , CurrencyPipe , DatePipe , RouterLink],
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})


export class BookListComponent implements OnInit {
  books: Book[] = [];
  currentPage: number = 1;
  keyword: string = '';
  pageSize: number = 10; // Should match your backend's resPerPage value
  hasNextPage: boolean = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    // Fetch the current page
    this.bookService.getBooks(this.currentPage, this.keyword).subscribe({
      next: (data) => {
        this.books = data;
        // Immediately check if the next page exists
        this.bookService.getBooks(this.currentPage + 1, this.keyword).subscribe({
          next: (nextData) => {
            this.hasNextPage = nextData && nextData.length > 0;
          },
          error: () => {
            this.hasNextPage = false;
          }
        });
      },
      error: (err) => console.error('Error fetching books:', err)
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

  onDelete(bookId: string): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => this.loadBooks(),
        error: (err) => console.error('Error deleting book:', err)
      });
    }
  }

  onEdit(book: Book): void {
    // Navigate to the edit page for the selected book
    this.router.navigate(['/admin-dashboard/books', book._id, 'edit']);
  }
}

