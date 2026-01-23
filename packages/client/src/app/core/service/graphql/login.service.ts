import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import { LOGIN_MUTATION } from '../../../shared/constants/auth';
import { LoginResponse, LoginVariables } from '../../../shared/types/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginGQL extends Mutation<LoginResponse, LoginVariables> {
  override document = LOGIN_MUTATION;
}
