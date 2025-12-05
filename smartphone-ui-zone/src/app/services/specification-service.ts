import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ISpecificationRead } from '../Models/Specification/ISpecificationRead';

@Injectable({
  providedIn: 'root',
})
export class SpecificationService {
  private readonly primaryUrl =
    'http://localhost:5079/api/PhoneSpecfications';
  private readonly fallbackUrl =
    'http://localhost:5079/api/PhoneSpecifications';

  constructor(private http: HttpClient) {}

  getAllSpecifications(): Observable<ISpecificationRead[]> {
    return this.http.get<ISpecificationRead[]>(this.primaryUrl).pipe(
      catchError((error) => {
        if (error.status === 404) {
          return this.http.get<ISpecificationRead[]>(this.fallbackUrl);
        }
        return throwError(() => error);
      })
    );
  }
}
