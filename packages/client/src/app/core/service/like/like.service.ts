import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { LikePostGQL, RemoveLikeGQL, GetLikesByPostIdGQL } from '../../gql.service';

@Injectable({
  providedIn: 'root',
})
export class LikesService {

  private likePostGQL = inject(LikePostGQL);
  private removeLikeGQl = inject(RemoveLikeGQL);
  private getLikesGQL = inject(GetLikesByPostIdGQL);

  likePost(postId: string) {
    return this.likePostGQL
      .mutate({ variables: { postId } })
      .pipe(map((result) => result.data?.like));
  }

  removeLike(postId: string) {
    return this.removeLikeGQl
      .mutate({ variables: { postId } })
      .pipe(map((result) => result.data?.removeLike));
  }

  getLikesByPostId(postId: string, offset?: number, limit?: number) {
    const queryRef = this.getLikesGQL.watch({
      variables: {
        postId,
        offset: offset || 0,
        limit: limit || 10,
      },
      fetchPolicy: 'cache-and-network',
    });
    return queryRef;
  }
}
