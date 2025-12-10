import { mergeTypeDefs } from '@graphql-tools/merge';
import { bookTypeDefs } from './typeDefs/books';
import { userTypeDefs } from './typeDefs/users';
import { postTypeDefs } from './typeDefs/posts';

export const typeDefs = mergeTypeDefs([bookTypeDefs, userTypeDefs, postTypeDefs]);
