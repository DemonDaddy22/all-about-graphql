import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Query {
    users: [User!]!
    userById(id: ID!): User
  }
`;
