import { ApplicationConfig, inject, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';

import { routes } from './app.routes';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client';
import extractFiles from 'extract-files/extractFiles.mjs';
import isExtractableFile from 'extract-files/isExtractableFile.mjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      const http = httpLink.create({
        uri: '/graphql',
        extractFiles: (body) => extractFiles(body, isExtractableFile),
      });
      const accessToken = localStorage.getItem('accessToken');

      const middleware = new ApolloLink((operation, forward) => {
        operation.setContext({
          headers: new HttpHeaders().set(
            'Authorization',
            accessToken ? `JWT ${accessToken}` : '',
          ),
        });

        return forward(operation);
      });

      const link = middleware.concat(http);

      return {
        cache: new InMemoryCache(),
        link,
      };
    }),
  ],
};
