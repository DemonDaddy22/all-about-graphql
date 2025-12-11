import { UpdateFilter } from 'mongodb';
import { Context, UserDoc } from '../types/resolvers';

export const postResolvers = {
  Query: {
    posts: async (_: any, __: any, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const usersCollection = db.collection('users');
      const posts = await postsCollection.find().toArray();
      return posts.map(async post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author: await usersCollection.findOne({ id: post.authorId }),
      }));
    },
    postById: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const usersCollection = db.collection('users');
      const post = await postsCollection.findOne({ id: args.id });
      return !post
        ? null
        : {
            id: post.id,
            title: post.title,
            content: post.content,
            author: await usersCollection.findOne({ id: post.authorId }),
          };
    },
  },
  Mutation: {
    createPost: async (_: any, args: { title: string; content: string; authorId: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const usersCollection = db.collection<UserDoc>('users');

      const newPost = {
        id: Date.now().toString(),
        title: args.title,
        content: args.content,
      };
      const postResult = await postsCollection.insertOne({ ...newPost, authorId: args.authorId });
      const post = await postsCollection.findOne({ _id: postResult.insertedId });

      // Update user's posts
      let author = await usersCollection.findOne({ id: args.authorId });
      if (author) {
        const update: UpdateFilter<UserDoc> = { $push: { posts: newPost.id } };
        author = await usersCollection.findOneAndUpdate({ id: args.authorId }, update, { returnDocument: 'after' });
      }

      return {
        id: post!.id,
        title: post!.title,
        content: post!.content,
        author: {
          ...(author && {
            id: author.id,
            name: author.name,
            email: author.email,
            posts: author.posts,
          }),
        },
      };
    },
    deletePost: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const result = await postsCollection.deleteOne({ id: args.id });
      return result.deletedCount === 1;
    },
    updatePost: async (_: any, args: { id: string; title?: string; content?: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const post = await postsCollection.findOne({ id: args.id });
      if (!post) {
        throw new Error('Post not found');
      }
      const updatedPost = {
        ...(post as unknown as Post),
        title: args.title ?? post.title,
        content: args.content ?? post.content,
      };
      await postsCollection.updateOne({ id: args.id }, { $set: updatedPost });
      return {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        author: await db.collection('users').findOne({ id: updatedPost.authorId }),
      };
    },
  },
};
