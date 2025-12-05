import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IManufacturerRead } from '../Models/Manufacturer/IManufacturerRead';

@Injectable({
  providedIn: 'root',
})
export class ManufacturerService {
  apiUrl : string = 'http://localhost:5079/api/Manufacturers';
  constructor (private http: HttpClient){}

  getAllManufacturer(): Observable<IManufacturerRead[]>{
    return this.http.get<IManufacturerRead[]>(this.apiUrl);
  }

}
