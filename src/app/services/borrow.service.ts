import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BorrowService {
  private apiUrl = 'http://localhost:3000/borrow'; // Base API URL

  constructor(private http: HttpClient) {}

  // Helper method to retrieve the auth header
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Borrow a book
  borrowBook(userId: string, bookId: string, dueDate: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${userId}/${bookId}`, 
      { dueDate },
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Return a borrowed book
  returnBook(userId: string, bookId: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${userId}/${bookId}/return`, 
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get all borrowed books by a user
  getUserBorrowedBooks(userId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/user/${userId}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get all users who borrowed a specific book
  getBorrowedUsers(bookId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/book/${bookId}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get full borrow history (Admin/Moderator access)
  getAllBorrowHistory(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/history`, 
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Delete a borrow record (Admin/Moderator access)
  deleteBorrowRecord(borrowId: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${borrowId}`, 
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Get borrowing analytics (Admin/Moderator access)
  getBorrowAnalytics(): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/dashboard`, 
      { headers: this.getAuthHeaders() }
    ).pipe(catchError(this.handleError));
  }

  // Handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('BorrowService Error:', error);
    return throwError(() => new Error(error.error?.message || 'Something went wrong'));
  }
}
