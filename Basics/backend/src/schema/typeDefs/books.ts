import { gql } from 'graphql-tag';

export const bookTypeDefs = gql`
  type Book {
    id: String!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]
  }
`;
