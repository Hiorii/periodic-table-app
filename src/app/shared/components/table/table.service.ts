import { Injectable } from '@angular/core';
import { TableColumn } from '../../../core/models/table-column.model';

@Injectable({
  providedIn: 'root'
})
export class TableService<T extends Object> {
  public initializeTableColumns(tableData: T[]): TableColumn[] {
    if (!tableData.length) {
      return [];
    }
    return Object.keys(tableData[0]).map((key) => ({
      name: key.toLowerCase(),
      title: key
    }));
  }
}
