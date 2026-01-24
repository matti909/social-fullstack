import { computed, inject, Injectable, signal } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { RegisterGQL } from './graphql/register.service';
import { LoginGQL } from './graphql/login.service';
import { GetUserGQL } from './graphql/getUser.service';
import { ACCESS_TOKEN, AUTH_USER } from '../../shared/constants/auth';
import { SEARCH_USERS_QUERY } from '../../shared/constants/user';
import {
  AuthState,
  LoginResponse,
  MaybeNullOrUndefined,
  RegisterResponse,
} from '../../shared/types/auth';
import { SearchUsersResponse, SearchUsersVariables, UsersResponse } from '../../shared/types/user';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apollo = inject(Apollo);
  private readonly registerGQL = inject(RegisterGQL);
  private readonly loginGQL = inject(LoginGQL);
  private readonly getUserGQL = inject(GetUserGQL);

  private readonly _authState = signal<AuthState>({
    isLoggedIn: false,
    currentUser: null,
    accessToken: null,
  });

  readonly authState = this._authState.asReadonly();
  readonly isLoggedIn = computed(() => this._authState().isLoggedIn);
  readonly authUser = computed(() => this._authState().currentUser);

  constructor() {
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const localToken = this.getLocalToken();
    let isLoggedIn = false;

    if (localToken) {
      isLoggedIn = this.tokenExists() && !this.tokenExpired(localToken);
    }

    if (!isLoggedIn) {
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(AUTH_USER);
    }

    this._authState.set({
      isLoggedIn,
      currentUser: this.getLocalUser(),
      accessToken: localToken,
    });
  }

  getLocalToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  storeUser(user: User): void {
    localStorage.setItem(AUTH_USER, JSON.stringify(user));
  }

  private getLocalUser(): User | null {
    const stored = localStorage.getItem(AUTH_USER);
    return stored ? JSON.parse(stored) : null;
  }

  private storeToken(token: string): void {
    localStorage.setItem(ACCESS_TOKEN, token);
  }

  private tokenExists(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN);
  }

  private tokenExpired(token: string): boolean {
    try {
      const tokenObj = JSON.parse(atob(token.split('.')[1]));
      return Date.now() > tokenObj.exp * 1000;
    } catch {
      return true;
    }
  }

  private updateAuthState(token: string, user: User): void {
    this.storeToken(token);
    this.storeUser(user);
    this._authState.set({
      isLoggedIn: true,
      currentUser: user,
      accessToken: token,
    });
  }

  private resetAuthState(): void {
    this._authState.set({
      isLoggedIn: false,
      currentUser: null,
      accessToken: null,
    });
  }

  register(
    fullName: string,
    username: string,
    email: string,
    password: string,
  ): Observable<MaybeNullOrUndefined<RegisterResponse>> {
    return this.registerGQL
      .mutate({
        variables: {
          fullName,
          username,
          email,
          password,
        },
      })
      .pipe(
        map((result) => result.data),
        tap((data) => {
          if (data?.register.token && data?.register.user) {
            this.updateAuthState(data.register.token, data.register.user);
          }
        }),
      );
  }

  login(email: string, password: string): Observable<MaybeNullOrUndefined<LoginResponse>> {
    return this.loginGQL
      .mutate({
        variables: {
          email,
          password,
        },
      })
      .pipe(
        map((result) => result.data),
        tap((data) => {
          if (data?.signIn.token && data?.signIn.user) {
            this.updateAuthState(data.signIn.token, data.signIn.user);
          }
        }),
      );
  }

  getUser(userId: string) {
    return this.getUserGQL
      .watch({ variables: { userId } })
      .valueChanges.pipe(map((result) => result.data));
  }

  searchUsers(searchQuery: string, offset: number, limit: number): SearchUsersResponse {
    const feedQuery = this.apollo.watchQuery<UsersResponse, SearchUsersVariables>({
      query: SEARCH_USERS_QUERY,
      variables: {
        searchQuery,
        offset,
        limit,
      },
      fetchPolicy: 'cache-first',
    });

    const fetchMore = (users: User[]): void => {
      feedQuery.fetchMore({
        variables: {
          offset: users.length,
        },
      });
    };

    return {
      data: feedQuery.valueChanges.pipe(map((result) => result.data)),
      fetchMore,
    };
  }

  logOut(): void {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(AUTH_USER);
    this.resetAuthState();
  }
}
