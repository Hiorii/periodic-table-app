import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-table-no-data',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="container" role="alert">
      <mat-icon aria-hidden="true">sentiment_very_dissatisfied</mat-icon>
      <span>No data available</span>
    </div>
  `,
  styleUrl: './table-no-data.component.scss'
})
export class TableNoDataComponent {}
