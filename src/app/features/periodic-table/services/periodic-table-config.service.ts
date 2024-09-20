import { Injectable } from '@angular/core';
import { PeriodicElement } from '../../../core/models/periodic-element.model';
import { TableActions } from '../../../core/models/table-actions.model';
import { TableColumn } from '../../../core/models/table-column.model';
import { TABLE_COLUMN_WIDTHS } from '../constants/periodic-table.constants';

@Injectable({
  providedIn: 'root'
})
export class PeriodicTableConfigService {
  public initializeTableActions(callback: (row: PeriodicElement) => void): TableActions<PeriodicElement>[] {
    return [
      {
        name: 'Edit',
        callback: (row: PeriodicElement) => callback(row)
      }
    ];
  }

  public initializeTableColumns(data: PeriodicElement[], actions: TableActions<PeriodicElement>[]): TableColumn[] {
    return Object.keys(data[0])
      .map((key) => ({
        name: key.toLowerCase(),
        title: key,
        width: this.getColumnWidth(key)
      }))
      .concat(actions.map(() => ({ name: 'actions', title: 'Actions', width: TABLE_COLUMN_WIDTHS.actions })));
  }

  private getColumnWidth(columnName: string): string {
    return TABLE_COLUMN_WIDTHS[columnName as keyof typeof TABLE_COLUMN_WIDTHS] || 'auto';
  }
}
