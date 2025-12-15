import { gql } from 'graphql-tag';

export const dogTypeDefs = gql`
  type Dog {
    id: ID!
    name: String!
    breed: String!
  }

  type Query {
    getDogs: [Dog!]!
  }
`;
