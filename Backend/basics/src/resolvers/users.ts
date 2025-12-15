import { v4 as uuid4 } from 'uuid';
import bcrypt from 'bcryptjs';

import { Context } from '../types/resolvers';
import { GraphQLError } from 'graphql';
import { signToken } from '../utils/auth';
import { AuthError, BadInputError } from '../utils/errors';

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const postsCollection = db.collection('posts');

      const users = await usersCollection.find().toArray();

      return await Promise.all(
        users.map(async user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          posts: await postsCollection.find({ id: { $in: user.posts || [] } }).toArray(),
        }))
      );
    },
    userById: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const postsCollection = db.collection('posts');

      const user = await usersCollection.findOne({ id: args.id });

      return !user
        ? null
        : {
            id: user.id,
            name: user.name,
            email: user.email,
            posts: await postsCollection.find({ id: { $in: user.posts || [] } }).toArray(),
          };
    },
    me: async (_: any, __: any, context: Context) => {
      const { db, user: contextUser } = context;
      const usersCollection = db.collection('users');
      const postsCollection = db.collection('posts');

      if (!contextUser) {
        return null;
      }
      const user = await usersCollection.findOne({ id: contextUser.id });
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        posts: await postsCollection.find({ id: { $in: user.posts || [] } }).toArray(),
      };
    },
  },
  Mutation: {
    createUser: async (_: any, args: { name: string; email: string; password: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const postsCollection = db.collection('posts');

      const existing = await usersCollection.findOne({ email: args.email });
      if (existing) {
        throw BadInputError('Email already exists');
      }

      const hashed = await bcrypt.hash(args.password, 10);

      const newUser = {
        id: uuid4(),
        name: args.name,
        email: args.email,
        password: hashed,
        posts: [],
      };
      const result = await usersCollection.insertOne(newUser);
      const user = await usersCollection.findOne({ _id: result.insertedId });

      if (!user) {
        throw new GraphQLError('Failed to create user', { extensions: { code: 'INTERNAL_SERVER_ERROR' } });
      }

      const token = signToken({ id: user.id, email: user.email });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          posts: await postsCollection.find({ id: { $in: user.posts || [] } }).toArray(),
        },
      };
    },
    login: async (_: any, args: { email: string; password: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const postsCollection = db.collection('posts');

      const user = await usersCollection.findOne({ email: args.email });
      if (!user) {
        throw AuthError();
      }

      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw AuthError();
      }

      const token = signToken({ id: user.id, email: user.email });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          posts: await postsCollection.find({ id: { $in: user.posts || [] } }).toArray(),
        },
      };
    },
    deleteUser: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');

      const result = await usersCollection.deleteOne({ id: args.id });
      return result.deletedCount === 1;
    },
    updateUser: async (_: any, args: { id: string; name?: string; email?: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');

      const user = await usersCollection.findOne({ id: args.id });
      if (!user) {
        throw new GraphQLError('User not found', { extensions: { code: 'NOT_FOUND' } });
      }

      const updatedUser = {
        ...(user as unknown as User),
        name: args.name !== undefined ? args.name : user.name,
        email: args.email !== undefined ? args.email : user.email,
      };
      await usersCollection.updateOne({ id: args.id }, { $set: updatedUser });

      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        posts: updatedUser.posts || [],
      };
    },
  },
};
