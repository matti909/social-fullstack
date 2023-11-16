import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  AfterInsert,
} from "typeorm";
import { User } from "./User";
import { Post } from "./Post";
import { AppDS } from "../config/ormconfig";
import { Notification } from "./Notification";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn() id: number;
  @Column("text") comment: string;
  @CreateDateColumn() createdAt: Date;

  @ManyToOne((type) => User, (user) => user.comments, { onDelete: "CASCADE" })
  author: User;
  @ManyToOne((type) => Post, (post) => post.comments, { onDelete: "CASCADE" })
  post: Post;

  @AfterInsert()
  async createNotification() {
    if (this.post && this.post.id) {
      const notificationRepository = AppDS.getRepository(Notification);
      const notification = notificationRepository.create();
      notification.user = (await AppDS.getRepository(User)
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.posts", "post")
        .where("post.id = :id", { id: this.post.id })
        .getOne()) as User;
      notification.postId = this.post.id;
      notification.text = `${this.author.fullName} commented on your post`;
      await notificationRepository.save(notification);
    }
  }
}
