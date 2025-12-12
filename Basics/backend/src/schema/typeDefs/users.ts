import { gql } from 'graphql-tag';

export const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    userById(id: ID!): User
    me: User
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    deleteUser(id: ID!): Boolean!
    updateUser(id: ID!, name: String, email: String): User!
  }
`;
