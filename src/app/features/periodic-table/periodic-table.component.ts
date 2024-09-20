import { Component, computed, DestroyRef, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { PeriodicElement } from '../../core/models/periodic-element.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TableComponent } from '../../shared/components/table/table.component';
import { TableColumn } from '../../core/models/table-column.model';
import { TableActions } from '../../core/models/table-actions.model';
import { EditPeriodicTableRowComponent } from './edit-periodic-table-row/edit-periodic-table-row.component';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { filter } from 'rxjs';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { FilterData } from '../../core/models/filter-data.model';
import { PeriodicTableConfigService } from './services/periodic-table-config.service';
import { TABLE_TITLE_DATA } from './constants/periodic-table.constants';

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
  public tableActions: TableActions<PeriodicElement>[] = [];
  public tableTitleData = TABLE_TITLE_DATA;
  public displayedPeriodicTableData = computed(() => this.getFilteredPeriodicTableData());
  private currentFilterValue: WritableSignal<string> = signal('');
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);
  private tableConfigService = inject(PeriodicTableConfigService);
  private dialogService = inject(DialogService);

  ngOnInit(): void {
    this.getDataAndInitializeTable();
  }

  public filterData(filterData: FilterData<PeriodicElement>): void {
    this.currentFilterValue.set(filterData.filteredValue);
  }

  private getDataAndInitializeTable(): void {
    this.dataService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.periodicTableData.set(data);
      this.initializeTableActions();
      this.initializeTableColumns();
    });
  }

  private initializeTableActions(): void {
    this.tableActions = this.tableConfigService.initializeTableActions(this.openEditDialog.bind(this));
  }

  private initializeTableColumns(): void {
    this.tableColumns = this.tableConfigService.initializeTableColumns(this.periodicTableData(), this.tableActions);
  }

  private getFilteredPeriodicTableData(): PeriodicElement[] {
    const data = this.periodicTableData();
    if (!data.length) {
      return [];
    }

    const filterValue = this.currentFilterValue().toLowerCase().trim();
    if (filterValue) {
      return data.filter((el) => Object.values(el).some((value) => value.toString().toLowerCase().includes(filterValue)));
    }
    return data;
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
