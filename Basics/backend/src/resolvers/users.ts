import { Context } from '../types/resolvers';

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const postsCollection = db.collection('posts');
      const users = await usersCollection.find().toArray();
      return users.map(async user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        posts: await postsCollection.find({ id: { $in: user.posts || [] } }).toArray(),
      }));
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
  },
  Mutation: {
    createUser: async (_: any, args: { name: string; email: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const newUser = {
        id: Date.now().toString(),
        name: args.name,
        email: args.email,
        posts: [],
      };
      const result = await usersCollection.insertOne(newUser);
      const user = await usersCollection.findOne({ _id: result.insertedId });
      return {
        id: user!.id,
        name: user!.name,
        email: user!.email,
        posts: user!.posts || [],
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
        throw new Error('User not found');
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
