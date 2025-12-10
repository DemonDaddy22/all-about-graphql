import { posts } from '../data/posts';
import { users } from '../data/users';

export const postResolvers = {
  Query: {
    posts: () => posts,
    postById: (_: any, args: { id: string }) => {
      return posts.find(post => post.id === args.id);
    },
    postAuthor: (_: any, args: { id: string }) => {
      const post = posts.find(post => post.id === args.id);
      if (!post) {
        return null;
      }
      return users.find(user => user.id === post.authorId);
    },
  },
};
