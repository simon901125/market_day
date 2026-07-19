/** "/api/notification/{id}/isRead" 標記已讀後的回傳結果 */
export interface NotificationToggleResult {
  id: number;
  isRead: boolean;
}
