import { mergeTypeDefs } from '@graphql-tools/merge';
import { dogTypeDefs } from './typeDefs/dogs';

export const typeDefs = mergeTypeDefs([dogTypeDefs]);
