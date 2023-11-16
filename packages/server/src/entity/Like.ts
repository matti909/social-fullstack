import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  AfterInsert,
} from "typeorm";
import { Notification } from "./Notification";

import { ManyToOne } from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { AppDS } from "../config/ormconfig";

@Entity("likes")
export class Like {
  @PrimaryGeneratedColumn() id: number;
  @CreateDateColumn() createdAt: Date;

  @ManyToOne((type) => User, (user) => user.likes, { onDelete: "CASCADE" })
  user: User;
  @ManyToOne((type) => Post, (post) => post.likes, { onDelete: "CASCADE" })
  post: Post;

  @AfterInsert()
  async createNotification() {
    if (this.post && this.post.id) {
      const notificationRepository = AppDS.getRepository(Notification);
      const notification = notificationRepository.create();
      notification.user = (await AppDS.getRepository(User)
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.posts", "post")
        .where("post.id = :id", { id: this.post?.id })
        .getOne()) as User;
      notification.postId = this.post?.id;
      notification.text = `${this.user.fullName} liked your post`;
      await notificationRepository.save(notification);
    }
  }
}
