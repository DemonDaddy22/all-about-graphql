import { GraphQLError } from 'graphql';

export const AuthError = (msg = 'Not authenticated') =>
  new GraphQLError(msg, { extensions: { code: 'UNAUTHENTICATED' } });

export const ForbiddenError = (msg = 'Not allowed') => new GraphQLError(msg, { extensions: { code: 'FORBIDDEN' } });

export const BadInputError = (msg: string) => new GraphQLError(msg, { extensions: { code: 'BAD_USER_INPUT' } });
