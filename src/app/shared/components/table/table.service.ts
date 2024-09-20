import { Injectable } from '@angular/core';
import { TableColumn } from '../../../core/models/table-column.model';
import { TableActions } from '../../../core/models/table-actions.model';

@Injectable({
  providedIn: 'root'
})
export class TableService<T extends Object> {
  public initializeTableColumns(tableData: T[], actions: TableActions<T>[] = []): TableColumn[] {
    if (!tableData.length) {
      return [];
    }
    const columns = Object.keys(tableData[0]).map((key) => ({
      name: key.toLowerCase(),
      title: key
    }));

    if (actions.length) {
      columns.push({
        name: 'actions',
        title: 'Actions'
      });
    }

    return columns;
  }
}
