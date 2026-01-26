import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Post as PostType, User } from '@ngsocial/graphql/types';
import {
  CommentEvent,
  DisplayLikesEvent,
  LikeEvent,
  ListCommentsEvent,
  MoreCommentsEvent,
  RemovePostEvent,
} from '../../types';

@Component({
  selector: 'app-post',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatInputModule],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  post = input.required<PostType>();
  authUser = input<Partial<User> | null>(null);
  commentsPerPost = input<number>(5);

  like = output<LikeEvent>();
  comment = output<CommentEvent>();
  listComments = output<ListCommentsEvent>();
  moreComments = output<MoreCommentsEvent>();
  remove = output<RemovePostEvent>();
  listLikes = output<DisplayLikesEvent>();

  commentInput = viewChild.required<ElementRef>('commentInput');
  commentsShown = false;

  get latestLike(): string {
    return `${this.post()?.likesCount ?? 0} Likes`;
  }

  displayLikes(): void {}

  displayComments(): void {
    this.commentsShown = !this.commentsShown;
    if (this.commentsShown) {
      this.listComments.emit({
        postId: this.post().id,
      });
    }
  }

  loadComments(): void {}

  sendLike(): void {}

  removePost(): void {
    this.remove.emit({
      id: this.post().id,
    });
  }

  createComment(e: Event): void {
    e.preventDefault();
    this.comment.emit({
      comment: this.commentInput().nativeElement.value,
      postId: this.post().id,
    });
    if (this.commentInput()) {
      this.commentInput().nativeElement.value = '';
    }
  }
}
