import { gql } from 'graphql-tag';

export const postTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    authorId: ID!
  }

  type Query {
    posts: [Post!]!
    postById(id: ID!): Post
    postAuthor(id: ID!): User
  }
`;
