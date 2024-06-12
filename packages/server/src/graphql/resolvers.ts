import {
  Comment,
  Like,
  Notification,
  Post,
  Resolvers,
  User,
} from "@ngsocial/graphql";
import { ApolloError } from "apollo-server-errors";
import crypto from "crypto";
import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import { DeleteResult, QueryFailedError } from "typeorm";
import { Context } from "..";
import { Post as PostEntity } from "../entity";
import { Comment as CommentEntity } from '../entity'
import { GraphQLUpload } from "graphql-upload-ts";
import AWS from "aws-sdk";

dotenv.config();
/* const spacesEndpoint = new AWS.Endpoint(process.env.S3_ENDPOINT as string);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
}); */

AWS.config.update({
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  region: process.env.REGION_AWS_BUCKET,
});

const s3 = new AWS.S3();

const hashPassword = async (plainPassword: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const bytes = crypto.randomBytes(16);
    const salt = bytes.toString("hex");
    crypto.scrypt(plainPassword, salt, 64, (error, buffer) => {
      if (error) reject(error);
      const hashedPassword = `${salt}:${buffer.toString("hex")}`;
      resolve(hashedPassword);
    });
  });
};

const compareToHash = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const result = hash.split(":");
    const salt = result[0];
    const hPass = result[1];
    crypto.scrypt(plainPassword, salt, 64, (error, buffer) => {
      if (error) reject(error);
      resolve(hPass == buffer.toString("hex"));
    });
  });
};

const resolvers: Resolvers = {
  Upload: GraphQLUpload,

  Query: {
    message: () => "It works!",

    getUser: async (_, args, ctx: Context) => {
      const postId = parseInt(args.userId, 10);
      const orm = ctx.orm;
      const user = await orm.userRepository.findOne({
        where: { id: postId },
      });
      if (!user) {
        throw new ApolloError("No user found", "USER_NOT_FOUND");
      }
      return user as unknown as User;
    },

    getPostsByUserId: async (_, args, ctx: Context) => {
      const posts = await ctx.orm.postRepository
        .createQueryBuilder("post")
        .where({ author: { id: args.userId } })
        .leftJoinAndSelect("post.author", "post_author")
        .leftJoinAndSelect("post.latestComment", "latestComment")
        .leftJoinAndSelect("latestComment.author", "latestComment_author")
        .leftJoinAndSelect("post.likes", "likes")
        .leftJoinAndSelect("likes.user", "likes_user")
        .orderBy("post.createdAt", "DESC")
        .skip(args.offset as number)
        .take(args.limit as number)
        .getMany();
      return posts as unknown as Post[];
    },

    getFeed: async (_, args, ctx: Context) => {
      const feed = await ctx.orm.postRepository
        .createQueryBuilder("post")
        .leftJoinAndSelect("post.author", "post_author")
        .leftJoinAndSelect("post.latestComment", "latestComment")
        .leftJoinAndSelect("latestComment.author", "latestComment_author")
        .leftJoinAndSelect("post.likes", "likes")
        .leftJoinAndSelect("likes.user", "likes_user")
        .orderBy("post.createdAt", "DESC")
        .skip(args.offset as number)
        .take(args.limit as number)
        .getMany();
      return feed as unknown as Post[];
    },

    getNotificationsByUserId: async (_, args, ctx: Context) => {
      const notifications = await ctx.orm.notificationRepository
        .createQueryBuilder("notification")
        .innerJoinAndSelect("notification.user", "user")
        .where("user.id = :userId", { userId: args.userId })
        .orderBy("notification.createdAt", "DESC")
        .skip(args.offset as number)
        .take(args.limit as number)
        .getMany();
      return notifications as unknown as Notification[];
    },
    getCommentsByPostId: async (_, args, ctx: Context) => {
      return (await ctx.orm.commentRepository
        .createQueryBuilder("comment")
        .innerJoinAndSelect("comment.author", "author")
        .innerJoinAndSelect("comment.post", "post")
        .where("post.id = :id", { id: args.postId as string })
        .orderBy("comment.createdAt", "DESC")
        .skip(args.offset as number)
        .take(args.limit as number)
        .getMany()) as unknown as Comment[];
    },
    getLikesByPostId: async (_, args, ctx: Context) => {
      return (await ctx.orm.likeRepository
        .createQueryBuilder("like")
        .innerJoinAndSelect("like.user", "user")
        .innerJoinAndSelect("like.post", "post")
        .where("post.id = :id", { id: args.postId })
        .orderBy("like.createdAt", "DESC")
        .skip(args.offset as number)
        .take(args.limit as number)
        .getMany()) as unknown as Like[];
    },
    searchUsers: async (_, args, ctx: Context) => {
      const users = await ctx.orm.userRepository
        .createQueryBuilder("user")
        .where(`user.fullName Like '%${args.searchQuery}%'`)
        .orWhere(`user.username Like '%${args.searchQuery}%'`)
        .getMany();
      return users as unknown as User[];
    },
  },
  Mutation: {
    post: async (_, args, { orm, authUser }: Context) => {
      const post = orm.postRepository.create({
        text: args.text,
        image: args.image,
        user: authUser,
      } as unknown as PostEntity);

      const savedPost = await orm.postRepository.save(post);

      await orm.userRepository.update(
        { id: authUser?.id },
        { postsCount: post.author.postsCount + 1 }
      );
      return savedPost as unknown as Post;
    },
    comment: async (_, args, { orm, authUser }: Context) => {
      const postId = parseInt(args.postId, 10);
      if (!authUser) {
        throw new ApolloError("User not authenticated", "UNAUTHENTICATED");
      }

      const post = await orm.postRepository.findOne({
        where: { id: postId },
      });

      if (!post) {
        throw new ApolloError("Post not found", "POST_NOT_FOUND");
      }

      const comment = orm.commentRepository.create({
        comment: args.comment,
        post: post,
        author: await orm.userRepository.findOne({
          where: { id: authUser.id },
        }),
      });

      const savedComment = await orm.commentRepository.save(comment);

      await orm.postRepository.update(post.id, {
        commentsCount: post.commentsCount + 1,
        latestComment: savedComment,
      });

      savedComment.post = await orm.postRepository.findOne({
        where: { id: post.id },
        relations: ["author", "comments", "likes"],
      });

      return savedComment as unknown as Comment;
    },

    like: async (_, args, { orm, authUser }: Context) => {
      const postId = parseInt(args.postId, 10);
      if (!authUser) {
        throw new ApolloError("User not authenticated", "UNAUTHENTICATED");
      }
    
      const user = await orm.userRepository.findOne({
        where: { id: authUser.id },
      });
    
      if (!user) {
        throw new ApolloError("User not found", "USER_NOT_FOUND");
      }
    
      const post = await orm.postRepository.findOne({
        where: { id: postId },
      });
    
      if (!post) {
        throw new ApolloError("Post not found", "POST_NOT_FOUND");
      }
    
      const like = orm.likeRepository.create({
        user: user,
        post: post,
      });
    
      const savedLike = await orm.likeRepository.save(like);
    
      await orm.postRepository.update(post.id, {
        likesCount: post.likesCount + 1,
      });
    
      savedLike.post = await orm.postRepository.findOne({
        where: { id: post.id },
        relations: ["author", "comments", "likes"],
      });
    
      return savedLike as unknown as Like;
    },
    
    removeLike: async (_, args, { orm, authUser }: Context) => {
      if (!authUser) {
        throw new ApolloError("User not authenticated", "UNAUTHENTICATED");
      }
    
      const postId = parseInt(args.postId, 10);
      if (isNaN(postId)) {
        throw new ApolloError("Invalid postId", "INVALID_POST_ID");
      }
    
      const like = await orm.likeRepository.findOne({
        where: {
          post: { id: postId },
          user: { id: authUser.id }
        },
        relations: ["user", "post"]
      });
    
      if (!like) {
        throw new ApolloError("Like not found", "LIKE_NOT_FOUND");
      }
    
      const result: DeleteResult = await orm.likeRepository.delete(like.id);
    
      if (result.affected === 0) {
        throw new ApolloError("Like not deleted", "LIKE_NOT_DELETED");
      }
    
      if (like.post.likesCount >= 1) {
        await orm.postRepository.update(like.post.id, {
          likesCount: like.post.likesCount - 1
        });
      }
    
      return like as unknown as Like;
    },
    
    removePost: async (_, { id }, { orm }: Context) => {
      const postId = parseInt(id, 10);
      const post = await orm.postRepository.findOne({
        relations: ["author"],
        where: { id: postId },
      });
      if (!post) {
        throw new ApolloError("Post not found", "POST_NOT_FOUND");
      }
      const result: DeleteResult = await orm.postRepository
        .createQueryBuilder()
        .delete()
        .from(PostEntity)
        .where("id = :id", { id: id })
        .execute();
      const postsCount = post?.author?.postsCount;
      if (postsCount && postsCount >= 1) {
        await orm.userRepository.update(
          { id: post?.author.id },
          { postsCount: postsCount - 1 }
        );
      }
      if (result.affected && result.affected <= 0) {
        throw new ApolloError("Post not deleted", "POST_NOT_DELETED");
      }
      return id;
    },
    removeComment: async (_, { id }, { orm }: Context) => {
      const postId = parseInt(id, 10);
      const comment = await orm.commentRepository.findOne({
        relations: ["author", "post"],
        where: { id: postId },
      });
      if (!comment) {
        throw new ApolloError("Comment not found", "COMMENT_NOT_FOUND");
      }
      const result: DeleteResult = await orm.commentRepository.delete(id);
      if (result.affected && result.affected <= 0) {
        throw new ApolloError("Comment not deleted", "COMMENT_NOT_DELETED");
      }
      const commentsCount = comment?.post?.commentsCount;
      if (commentsCount && commentsCount >= 1) {
        await orm.postRepository.update(comment.post.id, {
          commentsCount: commentsCount - 1,
        });
      }
      return comment as unknown as Comment;
    },
    removeNotification: async (_, { id }, { orm }: Context) => {
      const postId = parseInt(id, 10);
      const notificationRepository = orm.notificationRepository;
      const notification = await notificationRepository.findOne({
        relations: ["user"],
        where: { id: postId },
      });
      if (!notification) {
        throw new ApolloError(
          "Notification not found",
          "NOTIFICATION_NOT_FOUND"
        );
      }
      const result: DeleteResult = await notificationRepository.delete(id);
      if (result.affected && result.affected <= 0) {
        throw new ApolloError(
          "Notification not deleted",
          "NOTIFICATION_NOT_DELETED"
        );
      }
      return id;
    },

    register: async (_, args, { orm }) => {
      const { fullName, username, email, password } = args;
      let user = orm.userRepository.create({
        fullName: fullName,
        username: username,
        email: email,
        password: await hashPassword(password),
        postsCount: 0,
        image: "https://i.imgur.com/nzTFnsM.png",
      });
      const savedUser = await orm.userRepository
        .save(user)
        .catch((error: unknown) => {
          if (
            error instanceof QueryFailedError &&
            error.driverError.code == "ER_DUP_ENTRY"
          ) {
            throw new ApolloError(
              "A user with this email/username already exists",
              "USER_ALREADY_EXISTS"
            );
          }
        });

      console.log("saved user", savedUser.id);

      const token = jsonwebtoken.sign(
        { id: savedUser.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );
      return { token: token, user: savedUser };
    },

    signIn: async (_, args, { orm }) => {
      const { email, password } = args;
      const user = await orm.userRepository.findOne({
        where: { email: email },
      });
      if (!user) {
        throw new ApolloError(
          "No user found with this email!",
          "NO_USER_FOUND"
        );
      }
      if (!(await compareToHash(password, user.password))) {
        throw new ApolloError("Incorrect password!", "INCORRECT_PASSWORD");
      }
      const token = jsonwebtoken.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );
      return { token, user };
    },

    uploadFile: async (_, { file }) => {
      const { createReadStream, filename, mimetype, encoding } = await file;
      const fileStream = createReadStream();
      const uploadParams = {
        Bucket: process.env.S3_BUCKET as string,
        Key: filename,
        Body: fileStream,
        ACL: "public-read",
      };
      const result = await s3.upload(uploadParams).promise();
      console.log(result);
      const url = result.Location;
      return { url, filename, mimetype, encoding };
    },
  },
};
export default resolvers;
