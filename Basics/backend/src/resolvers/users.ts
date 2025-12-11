import { users } from '../data/users';
import { Context } from '../types/resolvers';

export const userResolvers = {
  Query: {
    users: async (_: any, __: any, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const users = await usersCollection.find().toArray();
      return users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        posts: user.posts || [],
      }));
    },
    userById: async (_: any, args: { id: string }, context: Context) => {
      const { db } = context;
      const usersCollection = db.collection('users');
      const user = await usersCollection.findOne({ id: args.id });
      return !user
        ? null
        : {
            id: user.id,
            name: user.name,
            email: user.email,
            posts: user.posts || [],
          };
    },
  },
  Mutation: {
    createUser: (_: any, args: { name: string; email: string }) => {
      const newUser = {
        id: Date.now().toString(),
        name: args.name,
        email: args.email,
        posts: [],
      };
      users.push(newUser);
      return newUser;
    },
    deleteUser: (_: any, args: { id: string }) => {
      const userIndex = users.findIndex(user => user.id === args.id);
      if (userIndex === -1) {
        return false;
      }
      users.splice(userIndex, 1);
      return true;
    },
    updateUser: (_: any, args: { id: string; name?: string; email?: string }) => {
      const user = users.find(user => user.id === args.id);
      if (!user) {
        throw new Error('User not found');
      }
      if (args.name !== undefined) {
        user.name = args.name;
      }
      if (args.email !== undefined) {
        user.email = args.email;
      }
      return user;
    },
  },
};
