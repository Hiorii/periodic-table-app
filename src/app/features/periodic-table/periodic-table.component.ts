import { Component, computed, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
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
import { TABLE_COLUMN_WIDTHS, TABLE_TITLE_DATA } from './constants/periodic-table.constants';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { FilterData } from '../../core/models/filter-data.model';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatProgressSpinner, TableComponent, EditPeriodicTableRowComponent, FilterComponent],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  public periodicTableData: WritableSignal<PeriodicElement[]> = signal([]);
  public tableColumns: TableColumn[] = [];
  public tableTitleData: TableTitle = TABLE_TITLE_DATA;
  public tableActions: TableActions<PeriodicElement>[] = [];
  public currentFilterValue: WritableSignal<string> = signal('');

  public displayedPeriodicTableData = computed(() => {
    if (!this.periodicTableData().length) {
      return [];
    }
    const filterValue = this.currentFilterValue().toLowerCase().trim();
    if (filterValue) {
      return this.periodicTableData().filter((el) =>
        Object.values(el).some((value) => value.toString().toLowerCase().includes(filterValue))
      );
    }
    return this.periodicTableData();
  });

  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);
  private tableService = inject(TableService);
  private dialogService = inject(DialogService);

  ngOnInit(): void {
    this.dataService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.periodicTableData.set(data);
      this.initializeTableActions();
      this.initializeTableColumns();
    });
  }

  public filterData(filterData: FilterData<PeriodicElement>): void {
    this.currentFilterValue.set(filterData.filteredValue);
  }

  private initializeTableActions(): void {
    this.tableActions = [
      {
        name: 'Edit',
        callback: (row: PeriodicElement) => this.openEditDialog(row)
      }
    ];
  }

  private initializeTableColumns(): void {
    this.tableColumns = this.tableService.initializeTableColumns(this.periodicTableData(), this.tableActions).map((col) => ({
      ...col,
      width: this.getColumnWidth(col.name)
    }));
  }

  private getColumnWidth(columnName: string): string {
    return TABLE_COLUMN_WIDTHS[columnName as keyof typeof TABLE_COLUMN_WIDTHS] || 'auto';
  }

  private openEditDialog(row: PeriodicElement): void {
    this.dialogService
      .openDialog(EditPeriodicTableRowComponent, { title: `Edit ${row.name}`, data: row })
      .pipe(takeUntilDestroyed(this.destroyRef), filter(Boolean))
      .subscribe((updatedRow: PeriodicElement) => {
        const updatedData = this.periodicTableData().map((el) => (el.position === updatedRow.position ? updatedRow : el));
        this.periodicTableData.set(updatedData);

        if (this.currentFilterValue()) {
          this.filterData({ data: updatedData, filteredValue: this.currentFilterValue() });
        }
      });
  }
}
