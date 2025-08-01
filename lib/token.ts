import jwt from "jsonwebtoken";

export function createToken(payload: { id: string }) {
  const token = jwt.sign(payload, process.env.AUTH_SECRET as string, {
    expiresIn: "1d",
  });
  return token;
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.AUTH_SECRET as string) as jwt.JwtPayload;
}
