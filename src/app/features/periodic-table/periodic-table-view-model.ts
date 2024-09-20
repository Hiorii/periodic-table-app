import { computed, DestroyRef, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { PeriodicElement } from '../../core/models/periodic-element.model';
import { DataService } from '../../core/services/data.service';
import { PeriodicTableConfigService } from './services/periodic-table-config.service';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableColumn } from '../../core/models/table-column.model';
import { TableActions } from '../../core/models/table-actions.model';
import { EditPeriodicTableRowComponent } from './edit-periodic-table-row/edit-periodic-table-row.component';
import { filter } from 'rxjs';
import { FilterData } from '../../core/models/filter-data.model';
import { filterPeriodicData } from './utils/filter.utils';

@Injectable({
  providedIn: 'root'
})
export class PeriodicTableViewModel {
  public periodicTableData: WritableSignal<PeriodicElement[]> = signal([]);
  public currentFilterValue: WritableSignal<string> = signal('');
  public tableColumns: WritableSignal<TableColumn[]> = signal([]);
  public tableActions: WritableSignal<TableActions<PeriodicElement>[]> = signal([]);
  public displayedPeriodicTableData = computed(() => this.getFilteredPeriodicTableData());
  private dataService = inject(DataService);
  private tableConfigService = inject(PeriodicTableConfigService);
  private dialogService = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  public init(): void {
    this.dataService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.periodicTableData.set(data);
      this.initializeTableActions();
      this.initializeTableColumns();
    });
  }

  public filterData(filterData: FilterData<PeriodicElement>): void {
    this.currentFilterValue.set(filterData.filteredValue);
  }

  public getFilteredPeriodicTableData(): PeriodicElement[] {
    return filterPeriodicData(this.periodicTableData(), this.currentFilterValue());
  }

  private initializeTableActions(): void {
    const tableActionsData = this.tableConfigService.initializeTableActions(this.openEditDialog.bind(this));
    this.tableActions.set(tableActionsData);
  }

  private initializeTableColumns(): void {
    const tableColumnsData = this.tableConfigService.initializeTableColumns(this.periodicTableData(), this.tableActions());
    this.tableColumns.set(tableColumnsData);
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
