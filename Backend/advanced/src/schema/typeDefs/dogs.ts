import { gql } from 'graphql-tag';

export const dogTypeDefs = gql`
  type Dog {
    id: ID!
    name: String!
    breed: String!
  }

  type Query {
    dogs: [Dog!]!
  }

  type Mutation {
    addDog(name: String!, breed: String!): Dog!
  }
`;
