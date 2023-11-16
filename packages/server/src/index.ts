import "reflect-metadata";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import path from "path";
import morgan from 'morgan'
import { Repository } from "typeorm";
import { AppDS } from "./config/ormconfig";
import { Comment, Like, Notification, Post, User } from "./entity";
import schema from "./graphql/schema";
import { graphqlUploadExpress } from "graphql-upload-ts"

dotenv.config({ path: path.join(__dirname, "..", ".env") });
const { JWT_SECRET } = process.env;

const getAuthUser = (token: string) => {
  try {
    if (token) {
      return jwt.verify(token, JWT_SECRET as string) as User;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export type Context = {
  orm: {
    userRepository: Repository<User>;
    postRepository: Repository<Post>;
    commentRepository: Repository<Comment>;
    likeRepository: Repository<Like>;
    notificationRepository: Repository<Notification>;
  };
  authUser: User | null;
};

async function startApolloServer() {
  const PORT = process.env.NODE_LOCAL_PORT ?? 8080;

  try {
    const app: Application = express();
    app.use(cors());
    app.use(morgan('dev'))
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

    const userRepository: Repository<User> = AppDS.getRepository(User);
    const postRepository: Repository<Post> = AppDS.getRepository(Post);
    const commentRepository: Repository<Comment> = AppDS.getRepository(Comment);
    const likeRepository: Repository<Like> = AppDS.getRepository(Like);
    const notificationRepository: Repository<Notification> =
      AppDS.getRepository(Notification);

    const server: ApolloServer = new ApolloServer({
      schema,
      context: ({ req }) => {
        const token = req.get("Authorization") || "";
        const authUser = getAuthUser(token.split(" ")[1]);
        const ctx: Context = {
          orm: {
            userRepository: userRepository,
            postRepository: postRepository,
            commentRepository: commentRepository,
            likeRepository: likeRepository,
            notificationRepository: notificationRepository,
          },
          authUser: authUser,
        };
        return ctx;
      },
    });

    await server.start();
    server.applyMiddleware({
      app,
      path: "/graphql",
    });

    app.get("/", (req, res) => res.send("Express is successfully running!"));

    await AppDS.initialize();
    console.log("Database connected on port:", process.env.MYSQLDB_LOCAL_PORT);

    app.listen(PORT, () => {
      console.log(
        `🚀 Apollo Server started on http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  } catch (err) {
    console.log("Database connection error: ", err);
  }
}

startApolloServer();
