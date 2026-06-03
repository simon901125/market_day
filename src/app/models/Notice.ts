export interface Notice {
  type: 'signup' | 'payment' | 'booth';
  text: string;
  status: string;
  statusClass: string;
  date: string;
  unread?: boolean;
}