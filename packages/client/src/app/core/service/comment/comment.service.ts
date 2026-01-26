import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CommentPostGQL, GetCommentsByPostIdGQL, RemoveCommentGQL } from '../../gql.service';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private commentPostGQL = inject(CommentPostGQL);
  private removeCommentGQL = inject(RemoveCommentGQL);
  private getCommentsByPostIdGQL = inject(GetCommentsByPostIdGQL);

  createComment(comment: string, postId: string) {
    return this.commentPostGQL
      .mutate({ variables: { comment, postId } })
      .pipe(map((result) => result.data?.comment));
  }

  removeComment(id: string) {
    return this.removeCommentGQL
      .mutate({ variables: { id } })
      .pipe(map((result) => result.data?.removeComment));
  }

  getCommentsByPostId(postId: string, offset?: number, limit?: number) {
    const queryRef = this.getCommentsByPostIdGQL.watch({
      variables: {
        postId,
        offset: offset || 0,
        limit: limit || 5304,
      },
      fetchPolicy: 'cache-and-network',
    });
    return queryRef;
  }
}
