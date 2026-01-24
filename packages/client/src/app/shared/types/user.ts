import { DeepPartial } from '@apollo/client/utilities';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

export type UserResponse = {
  getUser: User;
};
export type UsersResponse = {
  searchUsers: User[];
};
export type SearchUsersResponse = {
  data: Observable<UsersResponse | DeepPartial<UsersResponse> | undefined>;
  fetchMore: (users: User[]) => void;
};

// GraphQL variable types
export interface GetUserVariables {
  userId: string;
}
export interface SearchUsersVariables {
  searchQuery: string;
  offset?: number;
  limit?: number;
}
