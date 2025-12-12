import { gql } from 'graphql-tag';

export const postTypeDefs = gql`
  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    posts: [Post!]!
    postById(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
    deletePost(id: ID!): Boolean!
    updatePost(id: ID!, title: String, content: String): Post!
  }
`;
