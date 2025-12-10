import { books } from '../data/books';

export const bookResolvers = {
  Query: {
    books: () => books,
    bookById: (_: any, args: { id: string }) => {
      return books.find(book => book.id === args.id);
    },
  },
};
