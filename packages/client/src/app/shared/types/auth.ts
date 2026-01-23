import { User } from '../models/user.model';

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  accessToken: string | null;
}
export type AuthResponse = {
  token: string;
  user: User;
};
export type RegisterResponse = {
  register: AuthResponse;
};
export type LoginResponse = {
  signIn: AuthResponse;
};
export type MaybeNullOrUndefined<T> = T | null | undefined;

// GraphQL variable types
export interface RegisterVariables {
  fullName: string;
  username: string;
  email: string;
  password: string;
}
export interface LoginVariables {
  email: string;
  password: string;
}
