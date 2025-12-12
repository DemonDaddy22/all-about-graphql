import { UpdateFilter } from 'mongodb';
import { v4 as uuid4 } from 'uuid';
import { Context, UserDoc } from '../types/resolvers';
import { AuthError } from '../utils/errors';

export const postResolvers = {
  Query: {
    posts: async (_: any, __: any, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const usersCollection = db.collection('users');

      const posts = await postsCollection.find().toArray();

      return await Promise.all(
        posts.map(async post => {
          const author = await usersCollection.findOne({ id: post.authorId });

          return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: {
              id: author?.id,
              name: author?.name,
              email: author?.email,
              posts: author ? await postsCollection.find({ id: { $in: author.posts || [] } }).toArray() : [],
            },
          };
        })
      );
    },
    postById: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const postsCollection = db.collection('posts');
      const usersCollection = db.collection('users');

      const post = await postsCollection.findOne({ id: args.id });
      const author = await usersCollection.findOne({ id: post.authorId });

      return !post
        ? null
        : {
            id: post.id,
            title: post.title,
            content: post.content,
            author: {
              id: author?.id,
              name: author?.name,
              email: author?.email,
              posts: author ? await postsCollection.find({ id: { $in: author.posts || [] } }).toArray() : [],
            },
          };
    },
  },
  Mutation: {
    createPost: async (_: any, args: { title: string; content: string }, context: Context) => {
      const { db, user } = context;
      if (!user) {
        throw AuthError('You must be logged in to create a post');
      }

      const postsCollection = db.collection('posts');
      const usersCollection = db.collection<UserDoc>('users');

      const newPost = {
        id: uuid4(),
        title: args.title,
        content: args.content,
      };
      const postResult = await postsCollection.insertOne({ ...newPost, authorId: user.id });
      const post = await postsCollection.findOne({ _id: postResult.insertedId });

      // Update user's posts
      let author = await usersCollection.findOne({ id: user.id });
      if (author) {
        const update: UpdateFilter<UserDoc> = { $push: { posts: newPost.id } };
        author = await usersCollection.findOneAndUpdate({ id: user.id }, update, { returnDocument: 'after' });
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
            posts: author ? await postsCollection.find({ id: { $in: author.posts || [] } }).toArray() : [],
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
      const author = await db.collection('users').findOne({ id: updatedPost.authorId });

      return {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        author: {
          id: author?.id,
          name: author?.name,
          email: author?.email,
          posts: author ? await postsCollection.find({ id: { $in: author.posts || [] } }).toArray() : [],
        },
      };
    },
  },
};
