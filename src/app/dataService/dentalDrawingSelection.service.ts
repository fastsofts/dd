import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from "rxjs";
import { Drawing } from './dentalCategoryFormat.model'; // Import the type
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DentalDrawingSelectionService {
  constructor() { }
  private dentaldrawingSelected = new BehaviorSubject<Drawing>({} as Drawing);
  dentaldrawing$ = this.dentaldrawingSelected.asObservable();

  setDrawing(data:any){
     this.dentaldrawingSelected.next(data);
  }
}  