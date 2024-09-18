import { Component, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { PeriodicElement } from '../../core/models/periodic-element.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../core/models/table-column.model';
import { TableService } from '../../shared/components/table/table.service';
import { TableTitle } from '../../shared/components/table/models/table-title.model';
import { TableActions } from '../../core/models/table-actions.model';
import { EditPeriodicTableRowComponent } from './edit-periodic-table-row/edit-periodic-table-row.component';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { filter } from 'rxjs';
import { PeriodicElementsEnum } from '../../core/enums/periodic-elements.enum';
import { TABLE_COLUMN_WIDTHS, TABLE_TITLE_DATA } from './constants/periodic-table.constants';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatProgressSpinner, TableComponent, EditPeriodicTableRowComponent],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  public isDataLoaded: WritableSignal<boolean> = signal(false);
  public periodicTableData: WritableSignal<PeriodicElement[]> = signal([]);
  public tableColumns: TableColumn[] = [];
  public tableTitleData: TableTitle;
  public tableActions: TableActions<PeriodicElement>[] = [];
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);
  private tableService = inject(TableService);
  private dialogService = inject(DialogService);

  ngOnInit(): void {
    this.getDataAndInitializeTable();
  }

  private getDataAndInitializeTable(): void {
    this.dataService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.periodicTableData.set(data);
      this.isDataLoaded.set(true);
      if (this.isDataLoaded()) {
        this.initializeTableTitle();
        this.initializeTableActions();
      }
    });
  }

  private initializeTableTitle(): void {
    this.tableTitleData = {
      title: TABLE_TITLE_DATA.title,
      icon: TABLE_TITLE_DATA.icon
    };
  }

  private initializeTableColumns(): void {
    this.tableColumns = this.tableService.initializeTableColumns(this.periodicTableData(), this.tableActions);
    this.tableColumns = this.tableColumns.map((col) => ({
      ...col,
      width: this.getColumnWidth(col.name)
    }));
  }

  private getColumnWidth(columnName: string): string {
    switch (columnName) {
      case PeriodicElementsEnum.name:
        return TABLE_COLUMN_WIDTHS.name;
      case PeriodicElementsEnum.symbol:
        return TABLE_COLUMN_WIDTHS.symbol;
      case PeriodicElementsEnum.weight:
        return TABLE_COLUMN_WIDTHS.weight;
      case PeriodicElementsEnum.position:
        return TABLE_COLUMN_WIDTHS.position;
      case 'actions':
        return TABLE_COLUMN_WIDTHS.actions;
      default:
        return 'auto';
    }
  }

  private initializeTableActions(): void {
    this.tableActions = [
      {
        name: 'Edit',
        callback: (row: PeriodicElement) => {
          this.openEditDialog(row);
        }
      }
    ];
    this.initializeTableColumns();
  }

  private openEditDialog(row: PeriodicElement) {
    this.dialogService
      .openDialog(EditPeriodicTableRowComponent, { title: `Edit ${row.name}`, data: row })
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((result: PeriodicElement) => {
        const updatedData = this.periodicTableData().map((el) => (el.position === result.position ? result : el));
        this.periodicTableData.set(updatedData);
      });
  }
}
