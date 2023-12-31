import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { User, Post } from '@ngsocial/graphql/types';
import {
  RemovePostEvent,
  CommentEvent,
  ListCommentsEvent,
  MoreCommentsEvent,
  LikeEvent,
  DisplayLikesEvent,
} from '../..';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
})
export class PostComponent {
  @Input() post!: Post;
  @Input() authUser: Partial<User> | null = null;
  @Input() commentsPerPost: number = 5;

  @Output()
  like = new EventEmitter<LikeEvent>();
  @Output()
  comment = new EventEmitter<CommentEvent>();
  @Output()
  listComments = new EventEmitter<ListCommentsEvent>();
  @Output()
  moreComments = new EventEmitter<MoreCommentsEvent>();
  @Output()
  remove = new EventEmitter<RemovePostEvent>();
  @Output()
  listLikes = new EventEmitter<DisplayLikesEvent>();

  @ViewChild('commentInput')
  commentInput!: ElementRef;
  commentsShown: boolean = false;

  get latestLike(): string {
    return '${this.post?.likesCount ?? 0} Likes';
  }

  displayLikes(): void {}

  displayComments(): void {
    this.commentsShown = !this.commentsShown;
    if (this.commentsShown) {
      this.listComments.emit({
        postId: this.post.id,
      });
    }
  }

  loadComments(): void {}

  sendLike(): void {}

  removePost(): void {
    this.remove.emit({
      id: this.post.id,
    });
  }

  createComment(e: Event): void {
    e.preventDefault();
    this.comment.emit({
      comment: this.commentInput.nativeElement.value,
      postId: this.post.id,
    });
    if (this.commentInput) {
      this.commentInput.nativeElement.value = '';
    }
  }
}
