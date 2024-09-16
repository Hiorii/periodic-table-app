import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SpinnerService } from '../services/spinner.service';
import { delay, finalize } from 'rxjs';

export const httpSpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinnerService = inject(SpinnerService);
  spinnerService.spinnerStart();
  return next(req).pipe(
    delay(1200),
    finalize(() => {
      spinnerService.spinnerStop();
    })
  );
};
