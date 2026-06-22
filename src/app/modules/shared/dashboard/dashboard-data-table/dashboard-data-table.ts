import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';

export interface DashboardTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'imageText' | 'status' | 'action';
  align?: 'start' | 'center' | 'end';
  width?: string;
}

export interface DashboardTableAction {
  label: string;
  variant?: 'primary' | 'outline';
  row: Record<string, unknown>;
}

@Component({
  selector: 'app-dashboard-data-table',
  imports: [],
  templateUrl: './dashboard-data-table.html',
  styleUrl: './dashboard-data-table.scss',
})
export class DashboardDataTable {
  @Input() columns: DashboardTableColumn[] = [];
  @Input() rows: Record<string, any>[] = [];
  @Input() emptyText = '目前沒有資料';

  @Output() actionClick = new EventEmitter<DashboardTableAction>();

  getStatusClass(value: string): string {
    return ActivityStatus.getClass(value);
  }

  emitAction(column: DashboardTableColumn, row: Record<string, unknown>): void {
    this.actionClick.emit({
      label: String(row[`${column.key}Label`] ?? '查看詳情'),
      variant: (row[`${column.key}Variant`] as DashboardTableAction['variant']) ?? 'outline',
      row,
    });
  }
}
