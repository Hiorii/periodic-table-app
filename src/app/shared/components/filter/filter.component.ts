import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  Signal,
  WritableSignal
} from '@angular/core';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatIcon } from '@angular/material/icon';
import { FilterData } from '../../../core/models/filter-data.model';

type FilterForm = {
  filter: FormControl<string | null>;
};

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [MatFormField, MatInput, MatLabel, ReactiveFormsModule, MatProgressSpinner, MatIcon, MatPrefix, MatSuffix],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent<T> implements OnInit {
  public dataSource = input.required<T[]>();
  public isSearching: WritableSignal<boolean> = signal(false);
  public filteredData = output<FilterData<T>>();
  public filterForm: Signal<FormGroup<FilterForm>> = signal(
    new FormGroup<FilterForm>({
      filter: new FormControl<string | null>(null)
    })
  );
  private matTableDataSource = computed(() => new MatTableDataSource(this.dataSource()));
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.listenToFilterChanges();
  }

  private listenToFilterChanges(): void {
    this.filterForm()
      .controls.filter.valueChanges.pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => this.isSearching.set(true)),
        debounceTime(2000),
        distinctUntilChanged()
      )
      .subscribe((filterValue: string | null) => {
        const trimmedFilterValue = filterValue ? filterValue.trim().toLowerCase() : '';

        if (!trimmedFilterValue) {
          this.filteredData.emit({ data: this.dataSource(), filteredValue: '' });
        } else {
          this.matTableDataSource().filter = trimmedFilterValue;
          this.filteredData.emit({ data: this.matTableDataSource().filteredData, filteredValue: trimmedFilterValue });
        }
        this.isSearching.set(false);
      });
  }
}
