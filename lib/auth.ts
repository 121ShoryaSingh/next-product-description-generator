import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

interface JWTPayload {
  id: string;
  email: string;
}

export function signToken(payload: JWTPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
