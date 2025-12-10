import { users } from '../data/users';

export const userResolvers = {
  Query: {
    users: () => users,
    userById: (_: any, args: { id: string }) => {
      return users.find(user => user.id === args.id);
    },
  },
};
