// src/app/services/smartphone-service.ts
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISmartphoneRead } from '../Models/Smartphones/ISmartphoneRead';
import { IAddSmartPhone } from '../Models/Smartphones/IAddSmartPhone';
import { IUpdateSmartPhone } from '../Models/Smartphones/IUpdateSmartPhone';
import { ISpecificationRead } from '../Models/Specification/ISpecificationRead';

@Injectable({
  providedIn: 'root',
})
export class SmartphoneService {
  private readonly apiUrl = 'http://localhost:5079/api/Smartphones';

  constructor(private http: HttpClient) {}

  getAllSmartphones(): Observable<ISmartphoneRead[]> {
    return this.http.get<ISmartphoneRead[]>(this.apiUrl);
  }

  getSmartphoneById(id: number): Observable<ISmartphoneRead> {
    return this.http.get<ISmartphoneRead>(`${this.apiUrl}/${id}`);
  }

  addSmartphone(payload: IAddSmartPhone): Observable<string> {
    return this.http.post(this.apiUrl, payload, {
      responseType: 'text',
    }) as Observable<string>;
  }

  updateSmartphone(payload: IUpdateSmartPhone): Observable<string> {
    return this.http.post(`${this.apiUrl}/Update/${payload.id}`, payload, {
      responseType: 'text',
    }) as Observable<string>;
  }

  deleteSmartphone(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text',
    }) as Observable<string>;
  }

  searchByManufacturer(manufacturerName: string): Observable<ISmartphoneRead[]> {
    const params = new HttpParams().set('manufacturerName', manufacturerName);
    return this.http.post<ISmartphoneRead[]>(
      `${this.apiUrl}/Search/Manufacturer`,
      {},
      { params }
    );
  }

  searchBySpecification(spec: Partial<ISpecificationRead>): Observable<ISmartphoneRead[]> {
    return this.http.post<ISmartphoneRead[]>(
      `${this.apiUrl}/Search/Specification`,
      spec
    );
  }
}