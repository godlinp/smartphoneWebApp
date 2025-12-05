import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoginService } from '../services/login-service';
import { SessionExpirationService } from '../services/session-expiration.service';
import { Router } from '@angular/router';

/**
 * Authentication interceptor that adds Bearer token to all outgoing HTTP requests
 * and handles token expiration
 * @param req - The outgoing HTTP request
 * @param next - The next handler in the interceptor chain
 * @returns Observable of the HTTP event
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const loginService = inject(LoginService);
  const sessionExpirationService = inject(SessionExpirationService);
  const router = inject(Router);
  const token = loginService.getAuthToken();

  // Skip adding token for login requests to avoid circular dependencies
  if (req.url.includes('/login')) {
    return next(req);
  }

  // If token exists, clone the request and add Authorization header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if error is 401 Unauthorized (token expired)
        if (error.status === 401 && !req.url.includes('/login')) {
          // Clear the expired token
          loginService.logout();
          
          // Show session expired alert
          sessionExpirationService.showSessionExpiredAlert(() => {
            // Logout action - navigate to home or login
            router.navigate(['/']);
          });
        }
        return throwError(() => error);
      })
    );
  }

  // If no token, proceed with original request
  return next(req);
};
