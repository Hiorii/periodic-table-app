import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export const httpErrorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const _snackBar = inject(MatSnackBar);
  const toastCloseDuration = 2000;
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        // Info for recruiter -> this is just error handling example with 2 cases.
        // It should be extended for real production case.
        case 400:
          _snackBar.open('Bad request sent to API', 'close', { duration: toastCloseDuration });
          break;
        case 500:
          _snackBar.open('Server related error', 'close', { duration: toastCloseDuration });
          break;
        default:
          _snackBar.open('There were some problems with communication with API', 'close', { duration: toastCloseDuration });
          break;
      }

      return throwError(() => error);
    })
  );
};
