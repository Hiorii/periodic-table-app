import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PeriodicElement } from '../models/periodic-element.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dataUrl: string = environment.apiUrl;
  public data$: Observable<PeriodicElement[]> = inject(HttpClient).get<PeriodicElement[]>(this.dataUrl);
}
