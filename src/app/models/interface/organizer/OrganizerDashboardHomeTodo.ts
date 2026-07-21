export interface TodoItem {
  icon: string;
  count: number;
  unit: string;
  label: string;
  path: string;
  queryParams?: Record<string, string>;
  iconColor?: string;
}
