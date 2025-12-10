import { gql } from 'graphql-tag';

export const bookTypeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    bookById(id: ID!): Book
  }
`;
