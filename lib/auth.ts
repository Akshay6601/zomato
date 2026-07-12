import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return secret;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed);
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
}

export function generateToken(user: UserSession): string {
  return jwt.sign(user, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserSession;
  } catch {
    return null;
  }
}

export function getSession(req: NextRequest): UserSession | null {
  const token = req.cookies.get('zomato_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}
