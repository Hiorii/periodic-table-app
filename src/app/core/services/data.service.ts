import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../models/periodic-element.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataUrl: string = 'data/periodic-data.json';
  data$ = inject(HttpClient).get<PeriodicElement[]>(this.dataUrl);
}
