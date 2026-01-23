import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { GetUserVariables, UserResponse } from '../../../shared/types/user';
import { USER_QUERY } from '../../../shared/constants/user';

@Injectable({
  providedIn: 'root',
})
export class GetUserGQL extends Query<UserResponse, GetUserVariables> {
  override document = USER_QUERY;
}
