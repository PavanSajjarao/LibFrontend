import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode }from 'jwt-decode';

interface SignUpDto {
  name: string;
  email: string;
  password: string;
  role?: string[];
}

interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

interface JwtPayload {
  id: string;
  role: string[]; // Array of roles
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Adjust API URL

  constructor(private http: HttpClient) {}

  signUp(signUpDto: SignUpDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signUpDto).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role' , "user" );
      })
    );
  }

  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginDto).pipe(
      tap((res) => {
        // localStorage.setItem('token', res.token);
      })
    );
  }

  // logout() {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('role');
  // }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const token = this.getToken();
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

  getUserRoles(): string[] {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded.role || [];
      } catch (error) {
        console.error('Error decoding token:', error);
        return [];
      }
    }
    return [];
  }

  getSelectedUserRole(): string | null {
    return localStorage.getItem('role'); 
  }

  setSelectedUserRole(role: string): void {
    localStorage.setItem('role', role); // Set role in local storage
  }

  getUserRolesAPI(userId: string): Observable<{ roles: string[] }> {
    return this.http.get<{ roles: string[] }>(`http://localhost:3000/users/${userId}/roles`).pipe(
      tap((res) => {
        localStorage.setItem('role', JSON.stringify(res.roles)); // Store roles in localStorage
      })
    );
  }
  

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    window.location.reload();
  }
}
