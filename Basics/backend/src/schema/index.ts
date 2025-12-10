import { mergeTypeDefs } from '@graphql-tools/merge';
import { bookTypeDefs } from './typeDefs/books';

export const typeDefs = mergeTypeDefs([bookTypeDefs]);
