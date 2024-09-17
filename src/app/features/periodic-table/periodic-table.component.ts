import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { PeriodicElement } from '../../core/models/periodic-element.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatProgressSpinner],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  public isDataLoaded: WritableSignal<boolean> = signal(false);
  public periodicTableData: PeriodicElement[] = [];
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.getInitialData();
  }

  private getInitialData(): void {
    this.dataService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.periodicTableData = data;
      this.isDataLoaded.set(!!this.periodicTableData.length);
    });
  }
}
