import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { HttpHeaders } from '@angular/common/http';
import cache from './cache';

const uri = 'http://localhost:4000/graphql'; // <-- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const accessToken =
    localStorage.getItem('accessToken');
  const http = httpLink.create({ uri });
  const setAuthorizationLink = setContext(() => ({
    headers: new HttpHeaders().set(
      'Authorization', 'Bearer ${accessToken}'
    )
  }));
  return {
    link: from([setAuthorizationLink, http]),
    cache: cache
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule { }
