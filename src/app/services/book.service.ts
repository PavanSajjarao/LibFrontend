import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  _id: string;
  title: string;
  description: string;
  author: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  // Helper method to retrieve the auth header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch books with pagination and keyword filter
  getBooks(page: number = 1, keyword: string = ''): Observable<Book[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('keyword', keyword);

    const headers = this.getAuthHeaders();

    return this.http.get<Book[]>(this.apiUrl, { params, headers });
  }

  // Create a new book
  createBook(book: Partial<Book>): Observable<Book> {
    const headers = this.getAuthHeaders();
    return this.http.post<Book>(this.apiUrl, book, { headers });
  }

  // Update an existing book
  updateBook(bookId: string, book: Partial<Book>): Observable<Book> {
    const headers = this.getAuthHeaders();
    return this.http.put<Book>(`${this.apiUrl}/${bookId}`, book, { headers });
  }

  // Delete a book
  deleteBook(bookId: string): Observable<Book> {
    const headers = this.getAuthHeaders();
    return this.http.delete<Book>(`${this.apiUrl}/${bookId}`, { headers });
  }
}
