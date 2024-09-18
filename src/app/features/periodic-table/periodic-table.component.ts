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

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatProgressSpinner, TableComponent],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  public isDataLoaded: WritableSignal<boolean> = signal(false);
  public periodicTableData: PeriodicElement[] = [];
  public tableColumns: TableColumn[] = [];
  public tableTitleData: TableTitle;
  public tableActions: TableActions<PeriodicElement>[] = [];
  private dataService = inject(DataService);
  private destroyRef = inject(DestroyRef);
  private tableService = inject(TableService);

  ngOnInit(): void {
    this.getDataAndInitializeTable();
  }

  private getDataAndInitializeTable(): void {
    this.dataService.data$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.periodicTableData = data;
      this.isDataLoaded.set(true);
      if (this.isDataLoaded()) {
        this.initializeTableTitle();
        this.initializeTableActions();
      }
    });
  }

  private initializeTableTitle(): void {
    this.tableTitleData = {
      title: 'Periodic Table',
      icon: 'home'
    };
  }

  private initializeTableColumns(): void {
    this.tableColumns = this.tableService.initializeTableColumns(this.periodicTableData, this.tableActions);
  }

  private initializeTableActions(): void {
    this.tableActions = [
      {
        name: 'Edit',
        callback: (row) => {}
      }
    ];
    this.initializeTableColumns();
  }
}
