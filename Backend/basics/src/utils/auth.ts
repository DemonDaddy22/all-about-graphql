import jwt from 'jsonwebtoken';
import { TOKEN_EXPIRY } from '../constants';

const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
  throw new Error('Missing JWT_SECRET env var');
}

export const JWT_SECRET = SECRET as jwt.Secret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || TOKEN_EXPIRY;

export function signToken(payload: Record<string, unknown>): string {
  // cast expiresIn to any if types from lib are problematic
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET as jwt.Secret) as T;
}
