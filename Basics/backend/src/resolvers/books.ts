import { books } from '../data/books';

export const bookResolvers = {
  Query: {
    books: () => books,
  },
};
