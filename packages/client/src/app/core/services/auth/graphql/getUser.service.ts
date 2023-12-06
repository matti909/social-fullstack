import { Injectable } from '@angular/core';
import { Query } from 'apollo-angular';
import { UserResponse} from 'src/app/shared';
import { USER_QUERY } from 'src/app/shared/constants/user';

@Injectable({
  providedIn: 'root',
})
export class GetUserGQL extends Query<UserResponse> {
  override document = USER_QUERY;
}