import { posts } from '../data/posts';
import { users } from '../data/users';
import { Context } from '../types/resolvers';

export const postResolvers = {
  Query: {
    posts: async (_: any, __: any, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const posts = await postsCollection.find().toArray();
      return posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
      }));
    },
    postById: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const post = await postsCollection.findOne({ id: args.id });
      return !post
        ? null
        : {
            id: post.id,
            title: post.title,
            content: post.content,
            authorId: post.authorId,
          };
    },
    postAuthor: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const post = await postsCollection.findOne({ id: args.id });
      if (!post) {
        return null;
      }
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ id: post.authorId });
      return user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
            posts: user.posts || [],
          }
        : null;
    },
  },
  Mutation: {
    createPost: (_: any, args: { title: string; content: string; authorId: string }) => {
      const newPost = {
        id: Date.now().toString(),
        title: args.title,
        content: args.content,
      };
      posts.push({ ...newPost, authorId: args.authorId });
      const author = users.find(user => user.id === args.authorId);
      if (author) {
        author.posts.push(newPost);
      }
      return newPost;
    },
    deletePost: (_: any, args: { id: string }) => {
      const postIndex = posts.findIndex(post => post.id === args.id);
      if (postIndex === -1) {
        return false;
      }
      posts.splice(postIndex, 1);
      return true;
    },
    updatePost: (_: any, args: { id: string; title?: string; content?: string }) => {
      const post = posts.find(post => post.id === args.id);
      if (!post) {
        throw new Error('Post not found');
      }
      if (args.title !== undefined) {
        post.title = args.title;
      }
      if (args.content !== undefined) {
        post.content = args.content;
      }
      return post;
    },
  },
};
