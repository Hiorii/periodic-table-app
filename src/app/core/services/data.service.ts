import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../models/periodic-element.model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl: string = 'data/periodic-data.json';
  public data$: Observable<PeriodicElement[]> = inject(HttpClient)
    .get<PeriodicElement[]>(this.dataUrl)
    .pipe(
      catchError((error) => {
        console.error('Error fetching periodic data:', error);
        return of([]);
      })
    );
}
