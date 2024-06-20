import { NgModule } from '@angular/core';
import { ApolloClientOptions, createHttpLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import cache from './cache';
import { HttpClientModule } from '@angular/common/http';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const http = createHttpLink({
    uri: 'http://localhost:4000/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('accessToken');
    return {
      headers: {
        ...headers,
        authorization: token ? `JWT ${token}` : '',
      },
    };
  });
  return {
    link: authLink.concat(http),
    cache: cache,
  };
}

@NgModule({
  exports: [HttpClientModule, ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
