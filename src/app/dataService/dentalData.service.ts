import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DentalFormat } from './dentalFormat.model'; // Import the type
import { DentalCategoryFormat } from './dentalCategoryFormat.model'; // Import the type

@Injectable({
  providedIn: 'root',
})
export class DentalDataService {
  private jsonFileUrl = '/data/dentalchart.json'; // Path to your JSON file
  private jsonCategoryUrl = '/data/categories.json';

  constructor(private http: HttpClient) { }

  getDentalCategories():Observable<DentalCategoryFormat> { 
    return this.http.get<DentalCategoryFormat>(this.jsonCategoryUrl).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching JSON file', error);
        throw error;
      })
    );
  }  

  getDentalFormats(): Observable<DentalFormat> { 
    return this.http.get<DentalFormat>(this.jsonFileUrl).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching JSON file', error);
        throw error;
      })
    );
  }  
}

