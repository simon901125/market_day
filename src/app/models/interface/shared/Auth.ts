/** 系統角色 */
export type MarketDayRole = 'VENDOR' | 'ORGANIZER' | 'ADMIN';

export type AuthPortalRole = 'vendor' | 'organizer' | 'admin';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleCredentialRequest {
  credential: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface EmailVerificationRequest {
  email: string;
  code: string;
}

export interface PasswordResetCodeRequest {
  email: string;
}

export interface PasswordResetVerificationResponse {
  resetToken: string;
}

export interface ResetPasswordRequest {
  resetToken?: string;
  password: string;
}

export interface ChangePasswordRequest {
  password: string;
}

/** 系統使用者角色 */
export interface MarketDayUser {
  email: string;
  name: string;
  role: MarketDayRole;
  status: string;
  isLogin: boolean;
  provider?: string;
  googleSub?: string | null;
}

export interface LoginResponse {
  token: string;
  user: MarketDayUser;
}

export interface UserProfileResponse {
  user: MarketDayUser;
}
