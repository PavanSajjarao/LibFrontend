import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {
  private dateFormat = new BehaviorSubject<string>('MM/dd/yyyy'); // Default format
  dateFormat$ = this.dateFormat.asObservable();

  setDateFormat(format: string) {
    console.log('Updating date format to:', format); // ✅ Log change
    this.dateFormat.next(format);
  }
}