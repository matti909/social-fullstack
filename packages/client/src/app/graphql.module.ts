import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, from } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import cache from './cache';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const uri = 'http://localhost:4000/graphql';
  const http = httpLink.create({
    uri,
    extractFiles: (body) => extractFiles(body, isExtractableFile),
  });
  const accessToken = localStorage.getItem('accessToken');

  const setAuthorizationLink = setContext(() => ({
    headers: new HttpHeaders().set('Authorization', `JWT ${accessToken}`),
  }));
  return {
    link: from([setAuthorizationLink, http]),
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
