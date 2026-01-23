import { Injectable } from '@angular/core';
import { Mutation } from 'apollo-angular';
import { RegisterResponse, RegisterVariables } from '../../../shared/types/auth';
import { REGISTER_MUTATION } from '../../../shared/constants/auth';

@Injectable({
  providedIn: 'root',
})
export class RegisterGQL extends Mutation<RegisterResponse, RegisterVariables> {
  override document = REGISTER_MUTATION;
}
