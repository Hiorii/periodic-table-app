import { Component, computed, input, signal, ViewEncapsulation, WritableSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TableColumn } from '../../../core/models/table-column.model';
import { JsonPipe, NgStyle, TitleCasePipe } from '@angular/common';
import { TableTitleComponent } from './table-title/table-title.component';
import { TableNoDataComponent } from './table-no-data/table-no-data.component';
import { TableActions } from '../../../core/models/table-actions.model';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButton,
    JsonPipe,
    TitleCasePipe,
    TableTitleComponent,
    TableNoDataComponent,
    NgStyle,
    FilterComponent
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TableComponent<T> {
  tableTitle = input<string>();
  tableTitleIconName = input<string>();
  dataSource = input.required<T[]>();
  columns = input.required<TableColumn[]>();
  actions = input<TableActions<T>[]>([]);
  isFiltered: WritableSignal<boolean> = signal(false);
  filteredDataSource: WritableSignal<T[]> = signal([]);
  displayedDataSource = computed(() => {
    if (this.isFiltered() && this.filteredDataSource().length === 0) {
      return [];
    }
    return this.filteredDataSource().length ? this.filteredDataSource() : this.dataSource();
  });
  columnsDataDisplay = computed(() =>
    this.columns().map((column) => {
      return {
        name: column.name,
        width: column.width ? column.width : 'auto'
      };
    })
  );
  columnsNameToDisplay = computed(() => this.columns().map((column) => column.name));
  defaultTitle: string = 'Table';

  filterData(data: T[]) {
    this.isFiltered.set(true);
    this.filteredDataSource.set(data);
  }
}
