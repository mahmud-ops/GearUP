import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export const createToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);

  return token;
};
