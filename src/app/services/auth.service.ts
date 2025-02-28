import { Injectable } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

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

  // BehaviorSubject to store and track role changes
  private userRoleSubject = new BehaviorSubject<string | null>(this.getSelectedUserRole());
  userRole$ = this.userRoleSubject.asObservable(); // Expose it as Observable

  constructor(private http: HttpClient) {}

  signUp(signUpDto: SignUpDto): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, signUpDto).pipe(
    tap((res) => {
      localStorage.setItem('token', res.token);
      const decoded: JwtPayload = jwtDecode(res.token);

      // Check if role exists and is an array before accessing index 0
      const role = Array.isArray(decoded.role) && decoded.role.length > 0 ? decoded.role[0] : null;

      if (role) {
        localStorage.setItem('role', role);
        this.userRoleSubject.next(role); // Notify all components
      } else {
        console.warn('No role found in token');
      }
    })
  );
}


  login(loginDto: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginDto).pipe(
      tap((res) => {
        localStorage.setItem('token', res.token);
        const decoded: JwtPayload = jwtDecode(res.token);
        const role = decoded.role[0];
        localStorage.setItem('role', role);
        this.userRoleSubject.next(role); // Notify all components
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    this.userRoleSubject.next(null); // Notify components that role is now null
    window.location.reload();
  }

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

  getSelectedUserRole(): string | null {
    return localStorage.getItem('role'); 
  }

  setUserRole(role: string | null) {
    this.userRoleSubject.next(role);
  }

}
