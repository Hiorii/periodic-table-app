import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TableComponent } from '../../shared/components/table/table.component';
import { EditPeriodicTableRowComponent } from './edit-periodic-table-row/edit-periodic-table-row.component';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { TABLE_TITLE_DATA } from './constants/periodic-table.constants';
import { PeriodicTableViewModel } from './periodic-table-view-model';

@Component({
  selector: 'app-periodic-table',
  standalone: true,
  imports: [MatProgressSpinner, TableComponent, EditPeriodicTableRowComponent, FilterComponent],
  templateUrl: './periodic-table.component.html',
  styleUrl: './periodic-table.component.scss'
})
export class PeriodicTableComponent implements OnInit {
  public vm = inject(PeriodicTableViewModel);
  public periodicTableData = this.vm.periodicTableData;
  public displayedPeriodicTableData = this.vm.displayedPeriodicTableData;
  public tableColumns = this.vm.tableColumns;
  public tableActions = this.vm.tableActions;
  public tableTitleData = TABLE_TITLE_DATA;

  ngOnInit(): void {
    this.vm.init();
  }
}
