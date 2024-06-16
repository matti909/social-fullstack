import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Like } from "./Like";
import { Comment } from "./Comment";

@Entity()
export class 
Post {
  @PrimaryGeneratedColumn() id: number;
  @Column("longtext") text: string;
  @Column({ nullable: true }) image: string;
  @Column({ default: 0 }) commentsCount: number;
  @Column({ default: 0 }) likesCount: number;
  @Column({ default: "" }) latestLike: string;
  @CreateDateColumn() createdAt: Date;
  @Column({ default: false }) likedByAuthUser: boolean;

  @OneToOne((type) => Comment, (comment) => comment.post, {
    onDelete: "SET NULL",
  })
  @JoinColumn()
  latestComment: Comment;
  @ManyToOne((type) => User, (user) => user.posts, { onDelete: "CASCADE" })
  author: User;
  @OneToMany((type) => Comment, (comment) => comment.post) comments: Comment[];
  @OneToMany((type) => Like, (like) => like.post) likes: Like[];
}
