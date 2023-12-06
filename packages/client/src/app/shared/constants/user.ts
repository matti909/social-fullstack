import { gql } from 'apollo-angular';
import { BASIC_USER_FIELDS_FRAGMENT, USER_FIELDS_FRAGMENT } from './user.fragment';


export const USER_QUERY = gql`
 ${USER_FIELDS_FRAGMENT}
 query getUser($userId: ID!){  
  getUser(userId:$userId){ __typename ...UserFields }
 } 
`;
export const SEARCH_USERS_QUERY = gql` 
 ${BASIC_USER_FIELDS_FRAGMENT}
 query searchUsers(
  $searchQuery: String!,
  $offset: Int, 
  $limit: Int){  
  searchUsers(
    searchQuery:$searchQuery,
    offset: $offset,
    limit: $limit){ __typename ...BasicUserFields }
 }  
`;