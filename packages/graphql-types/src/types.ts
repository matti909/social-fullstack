export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  post: Post;
};

export type File = {
  __typename?: 'File';
  encoding?: Maybe<Scalars['String']['output']>;
  filename?: Maybe<Scalars['String']['output']>;
  mimetype?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type Like = {
  __typename?: 'Like';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  post: Post;
  user: User;
};

export type Mutation = {
  __typename?: 'Mutation';
  comment?: Maybe<Comment>;
  like?: Maybe<Like>;
  post?: Maybe<Post>;
  register: AuthPayload;
  removeComment?: Maybe<Comment>;
  removeLike?: Maybe<Like>;
  removeNotification?: Maybe<Scalars['ID']['output']>;
  removePost?: Maybe<Scalars['ID']['output']>;
  setUserBio?: Maybe<User>;
  setUserCover?: Maybe<User>;
  setUserPhoto?: Maybe<User>;
  signIn: AuthPayload;
  uploadFile?: Maybe<File>;
};


export type MutationCommentArgs = {
  comment: Scalars['String']['input'];
  postId: Scalars['ID']['input'];
};


export type MutationLikeArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationPostArgs = {
  image?: InputMaybe<Scalars['String']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationRemoveCommentArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoveLikeArgs = {
  postId: Scalars['ID']['input'];
};


export type MutationRemoveNotificationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemovePostArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetUserBioArgs = {
  bio: Scalars['String']['input'];
};


export type MutationSetUserCoverArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationSetUserPhotoArgs = {
  file: Scalars['Upload']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUploadFileArgs = {
  file: Scalars['Upload']['input'];
};

export type Notification = {
  __typename?: 'Notification';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  postId: Scalars['ID']['output'];
  text: Scalars['String']['output'];
};

export type Post = {
  __typename?: 'Post';
  author: User;
  commentsCount: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  latestComment?: Maybe<Comment>;
  latestLike?: Maybe<Scalars['String']['output']>;
  likedByAuthUser?: Maybe<Scalars['Boolean']['output']>;
  likesCount: Scalars['Int']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getCommentsByPostId?: Maybe<Array<Maybe<Comment>>>;
  getFeed?: Maybe<Array<Maybe<Post>>>;
  getLikesByPostId?: Maybe<Array<Maybe<Like>>>;
  getNotificationsByUserId?: Maybe<Array<Maybe<Notification>>>;
  getPostsByUserId?: Maybe<Array<Maybe<Post>>>;
  getUser?: Maybe<User>;
  message: Scalars['String']['output'];
  searchUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetCommentsByPostIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['ID']['input'];
};


export type QueryGetFeedArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGetLikesByPostIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  postId: Scalars['ID']['input'];
};


export type QueryGetNotificationsByUserIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetPostsByUserIdArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId: Scalars['ID']['input'];
};


export type QueryGetUserArgs = {
  userId: Scalars['ID']['input'];
};


export type QuerySearchUsersArgs = {
  searchQuery?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  bio?: Maybe<Scalars['String']['output']>;
  coverImage?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  postsCount: Scalars['Int']['output'];
  username: Scalars['String']['output'];
};
