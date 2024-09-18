import { Component, computed, Inject, OnInit, signal, Signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TitleCasePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatButton, MatFabButton } from '@angular/material/button';
import { PeriodicElement } from '../../../core/models/periodic-element.model';

type EditTableRowForm = {
  position: FormControl<number | null>;
  name: FormControl<string | null>;
  weight: FormControl<number | null>;
  symbol: FormControl<string | null>;
};

@Component({
  selector: 'app-edit-periodic-table-row',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, TitleCasePipe, MatDialogActions, MatButton, MatFabButton],
  templateUrl: './edit-periodic-table-row.component.html',
  styleUrl: './edit-periodic-table-row.component.scss'
})
export class EditPeriodicTableRowComponent implements OnInit {
  editForm: Signal<FormGroup<EditTableRowForm>> = signal(
    new FormGroup<EditTableRowForm>({
      position: new FormControl<number | null>({ value: null, disabled: true }, [Validators.required]),
      name: new FormControl<string | null>(null, [Validators.required]),
      weight: new FormControl<number | null>(null, [Validators.required]),
      symbol: new FormControl<string | null>(null, [Validators.required])
    })
  );
  editFormControls = computed(() => Object.keys(this.editForm().controls));
  title: WritableSignal<string | null> = signal('');

  constructor(
    private readonly _dialogRef: MatDialogRef<EditPeriodicTableRowComponent>,
    @Inject(MAT_DIALOG_DATA) private readonly _data: { title: string; data: PeriodicElement }
  ) {}

  ngOnInit(): void {
    this.initializeFormData();
  }

  private initializeFormData(): void {
    this.title.set(this._data.title);
    this.editForm().controls.position.setValue(this._data.data.position);
    this.editForm().controls.name.setValue(this._data.data.name);
    this.editForm().controls.weight.setValue(this._data.data.weight);
    this.editForm().controls.symbol.setValue(this._data.data.symbol);
  }

  cancel(): void {
    this._dialogRef.close();
  }

  save(): void {
    if (this.editForm().valid) {
      const updatedElement = {
        position: this.editForm().getRawValue().position,
        name: this.editForm().value.name,
        weight: this.editForm().value.weight,
        symbol: this.editForm().value.symbol
      };
      this._dialogRef.close(updatedElement);
    }
  }
}
