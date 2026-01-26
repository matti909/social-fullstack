import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CreatePostGQL, RemovePostGQL, UploadFileGQL } from '../../gql.service';
import { Apollo } from 'apollo-angular';
import {
  GetPostsByUserIdDocument,
  GetPostsByUserIdQuery,
  GetPostsByUserIdQueryVariables,
} from '@ngsocial/graphql/documents';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private createPostGQL = inject(CreatePostGQL);
  private removePostGQL = inject(RemovePostGQL);
  private uploadFileGQL = inject(UploadFileGQL);
  private apollo = inject(Apollo);

  uploadFile(image: File) {
    return this.uploadFileGQL
      .mutate({
        variables: { file: image },
        context: { useMultipart: true },
      })
      .pipe(map((result) => result.data?.uploadFile));
  }

  createPost(text: string | null, image: string | null) {
    return this.createPostGQL
      .mutate({ variables: { text, image } })
      .pipe(map((result) => result.data?.post));
  }

  removePost(id: string) {
    return this.removePostGQL
      .mutate({
        variables: { id },
        refetchQueries: ['getUser'],
      })
      .pipe(map((result) => result.data?.removePost));
  }

  getPostsByUserId(userId: string, offset?: number, limit?: number) {
    const queryRef = this.apollo.watchQuery<GetPostsByUserIdQuery, GetPostsByUserIdQueryVariables>({
      query: GetPostsByUserIdDocument,
      variables: {
        userId,
        offset: offset || 0,
        limit: limit || 10,
      },
      fetchPolicy: 'cache-and-network',
    });
    return queryRef;
  }
}
