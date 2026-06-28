import { AuthPortalRole } from '../../models/interface/shared/Auth';

const AUTH_TOKEN_KEY = 'MarketDayToken';
const AUTH_USER_KEY = 'MarketDayUser';
const PENDING_REGISTRATION_EMAIL_KEY = 'MarketDayPendingRegistrationEmail';
const PASSWORD_RESET_EMAIL_KEY = 'MarketDayPasswordResetEmail';
const PASSWORD_RESET_TOKEN_KEY = 'MarketDayPasswordResetToken';

export const getAuthTokenKey = (role: AuthPortalRole): string =>
  `${AUTH_TOKEN_KEY}_${role}`;

export const getAuthUserKey = (role: AuthPortalRole): string =>
  `${AUTH_USER_KEY}_${role}`;

export const getPendingRegistrationEmailKey = (
  role: Exclude<AuthPortalRole, 'admin'>
): string => `${PENDING_REGISTRATION_EMAIL_KEY}_${role}`;

export const getPasswordResetEmailKey = (
  role: Exclude<AuthPortalRole, 'admin'>
): string => `${PASSWORD_RESET_EMAIL_KEY}_${role}`;

export const getPasswordResetTokenKey = (
  role: Exclude<AuthPortalRole, 'admin'>
): string => `${PASSWORD_RESET_TOKEN_KEY}_${role}`;
