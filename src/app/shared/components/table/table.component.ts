import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { TableColumn } from '../../../core/models/table-column.model';
import { JsonPipe, NgStyle, TitleCasePipe } from '@angular/common';
import { TableTitleComponent } from './table-title/table-title.component';
import { TableNoDataComponent } from './table-no-data/table-no-data.component';
import { TableActions } from '../../../core/models/table-actions.model';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButton, JsonPipe, TitleCasePipe, TableTitleComponent, TableNoDataComponent, NgStyle],
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

  getColumnWidth(column: TableColumn): string {
    return column.width ? column.width : 'auto';
  }
}
