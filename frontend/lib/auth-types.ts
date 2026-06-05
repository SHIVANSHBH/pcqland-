export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginInput {
  email?: string;
  phone?: string;
  password?: string;
}

export interface OtpInput {
  email?: string;
  phone?: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  emailVerified: boolean;
  phoneVerified: boolean;
  walletBalance: number;
  createdAt: string;
}
