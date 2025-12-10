import { users } from '../data/users';

export const userResolvers = {
  Query: {
    users: () => users,
    userById: (_: any, args: { id: string }) => {
      return users.find(user => user.id === args.id);
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
