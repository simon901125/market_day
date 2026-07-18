import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivityStatus } from '../../../../models/status/ActivityStatus';
import { ApplicationStatus } from '../../../../models/status/ApplicationStatus';

export interface DashboardTableColumn {
  key: string;
  label: string;
  type?: 'text' | 'imageText' | 'status' | 'progress' | 'action';
  align?: 'start' | 'center' | 'end';
  width?: string;
  minWidth?: string;
  nowrap?: boolean;
  actionMinWidth?: string;
}

export interface DashboardTableAction {
  key?: string;
  label: string;
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'muted';
  disabled?: boolean;
  hint?: string;
  row: Record<string, unknown>;
}

export interface DashboardTableRowAction {
  key?: string;
  label: string;
  variant?: DashboardTableAction['variant'];
  disabled?: boolean;
  hint?: string;
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
  @Input() tableMinWidth = '960px';
  @Input() emptyText = '目前沒有資料';

  @Output() actionClick = new EventEmitter<DashboardTableAction>();

  getStatusClass(value: string): string {
    return ActivityStatus.classMap[value] ?? ApplicationStatus.getClass(value);
  }

  getProgressCurrent(column: DashboardTableColumn, row: Record<string, any>): number {
    return Number(row[`${column.key}Current`]) || 0;
  }

  getProgressTotal(column: DashboardTableColumn, row: Record<string, any>): number {
    return Number(row[`${column.key}Total`]) || 0;
  }

  getProgressPercent(column: DashboardTableColumn, row: Record<string, any>): number {
    const total = this.getProgressTotal(column, row);
    if (total <= 0) return 0;
    return Math.min(100, Math.round(this.getProgressCurrent(column, row) / total * 100));
  }

  getRowActions(column: DashboardTableColumn, row: Record<string, any>): DashboardTableRowAction[] {
    const actions = row[`${column.key}Actions`] ?? row['actions'];

    if (Array.isArray(actions) && actions.length > 0) {
      return actions;
    }

    return [
      {
        label: String(row[`${column.key}Label`] ?? '查看'),
        variant: (row[`${column.key}Variant`] as DashboardTableAction['variant']) ?? 'outline',
      },
    ];
  }

  emitRowAction(row: Record<string, unknown>, action: DashboardTableRowAction): void {
    this.actionClick.emit({
      key: action.key,
      label: action.label,
      variant: action.variant ?? 'outline',
      disabled: action.disabled,
      hint: action.hint,
      row,
    });
  }

  emitAction(column: DashboardTableColumn, row: Record<string, unknown>): void {
    this.actionClick.emit({
      label: String(row[`${column.key}Label`] ?? '查看'),
      variant: (row[`${column.key}Variant`] as DashboardTableAction['variant']) ?? 'outline',
      row,
    });
  }
}
