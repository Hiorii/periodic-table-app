import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [SpinnerComponent],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  dataService = inject(DataService);

  ngOnInit(): void {
    this.getInitialData();
  }

  private getInitialData() {
    this.dataService.data$.subscribe((data) => {
      console.log(data);
    });
  }
}
