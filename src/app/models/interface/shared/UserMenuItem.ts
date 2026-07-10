export interface UserMenuItem {
  label: string;
  icon: string;
  path?: string;
  action?: 'logout' | 'account-settings' | 'organizer-profile';
}
