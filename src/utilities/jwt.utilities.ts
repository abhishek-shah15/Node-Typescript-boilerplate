import * as jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY || "lljsadfjasdfqw3rewnwqerlwer";
const issuer = "abcd";

interface IJWTPayload {
  [key: string]: any;
}
export function createJWTToken(
  payload: IJWTPayload,
  expiresIn = "10m"
): Promise<any> {
  let options: { [key: string]: any } = {
    issuer,
    expiresIn,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, options, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve(token);
    });
  });
}

export function verifyJWTToken(token: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, { issuer }, (err, payload) => {
      if (err) {
        return reject(err);
      }
      resolve(payload);
    });
  });
}
