import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import cache from './cache';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';
import { HttpHeaders } from '@angular/common/http';

const accessToken = localStorage.getItem('accessToken');
const setAuthorizationLink = setContext(() => ({
  headers: new HttpHeaders().set(
    'Authorization', `Bearer ${accessToken}`
  )
}));

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink) {
        return {
          cache: cache,
          link: httpLink.create({
            uri: 'http://localhost:4000/graphql',
            extractFiles: (body) => extractFiles(body, isExtractableFile),
          }),
          setAuthorizationLink //<-- Probar esto!
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
function setContext(arg0: () => { headers: any; }) {
  throw new Error('Function not implemented.');
}

