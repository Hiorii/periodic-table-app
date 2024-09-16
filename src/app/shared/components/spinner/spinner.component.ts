import { Component, inject } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { SpinnerService } from '../../../core/services/spinner.service';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [MatProgressSpinner],
  template: `
    @if (spinnerService.spinnerSignal()) {
      <mat-spinner></mat-spinner>
    }
  `
})
export class SpinnerComponent {
  spinnerService = inject(SpinnerService);
}
