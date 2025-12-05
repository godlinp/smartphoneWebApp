import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILogin } from '../Models/login/ILogin';
import { ILoginResponse } from '../Models/login/ILoginResponse';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiUrl = 'http://localhost:5079/login';

  constructor(private http: HttpClient) {}

  /**
   * Authenticate user with username and password
   * @param loginData - ILogin object containing username and password
   * @returns Observable with authentication response
   */
  login(loginData: ILogin): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(this.apiUrl, loginData);
  }

  /**
   * Check if user is currently logged in
   * @returns boolean indicating login status
   */
  isLoggedIn(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  /**
   * Store authentication token in localStorage
   * @param token - JWT or authentication token
   */
  setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  /**
   * Get stored authentication token
   * @returns stored token or null if not found
   */
  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Logout user by removing authentication token
   */
  logout(): void {
    localStorage.removeItem('authToken');
  }
}
