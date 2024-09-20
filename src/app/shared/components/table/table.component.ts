import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {
  public tableTitle = input<string>();
  public tableTitleIconName = input<string>();
  public dataSource = input.required<T[]>();
  public columns = input.required<TableColumn[]>();
  public actions = input<TableActions<T>[]>([]);
  public columnsDataDisplay = computed(() =>
    this.columns().map((column) => {
      return {
        name: column.name,
        width: column.width ? column.width : 'auto'
      };
    })
  );
  public columnsNameToDisplay = computed(() => this.columns().map((column) => column.name));
  public defaultTitle: string = 'Table';
}
