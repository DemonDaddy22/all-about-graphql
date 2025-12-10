import { posts } from '../data/posts';

export const postResolvers = {
  Query: {
    posts: () => posts,
    postById: (_: any, args: { id: string }) => {
      return posts.find(post => post.id === args.id);
    },
  },
};
