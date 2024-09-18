import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '../../../core/models/dialog-data.model';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  matDialog = inject(MatDialog);

  openDialog<T, D = DialogData<T>>(component: ComponentType<T>, data?: D) {
    const dialogRef = this.matDialog.open<T, D>(component, { data });

    return dialogRef.afterClosed();
  }
}
