import { Request, Response } from "express";
import { auth } from "firebase-admin";
import { logger } from "../logger";
import { verifyJWTToken } from "../utilities/jwt.utilities";
import { isNullOrUndefined } from "../utilities/type-guards";

export interface IAuthenticatedRequest extends Request {
  user: auth.DecodedIdToken;
}


export interface IOptionalAuthenticatedReq extends Request {
  user?: {
    uid: string;
    [k: string]: any;
  };
}
export async function verifyOptionalToken(
  req: IAuthenticatedRequest,
  res: Response,
  next: any
) {
  const authToken = req.get("Authorization");
  if (!authToken) {
    return next();
  }
  const authTokenComponents = authToken.split(" ");
  if (
    authTokenComponents.length !== 2 ||
    "Bearer" !== authTokenComponents[0] ||
    authTokenComponents[1].length === 0
  ) {
    return next();
  }
  try {
    const userData = await verifyJWTToken(authTokenComponents[1]);
    if (!isNullOrUndefined(userData.uid)) {
      req.user = userData;
    }
  } catch (err) {
    res.status(401).json({
      error: {
        message: "Authentication Failed. Provided token is not valid.",
        details: [{ path: "token", message: err.message }],
      },
    });
  }
  return next();
}

export function verifyCustomToken(user_type: string) {
  return async function (req: IAuthenticatedRequest, res: Response, next: any) {
    try {
      const token = await validateTokenInRequest(req);
      req.user = await verifyJWTToken(token);
      if (isNullOrUndefined(req.user.uid) || req.user.user_type !== user_type) {
        return res.status(401).json({
          error: {
            message:
              "Authentication Failed. You are not authorized to view this page.",
            details: [{ path: "token", message: "No valid token found" }],
          },
        });
      }
      return next();
    } catch (err) {
      logger.error("Authentication Error", err);
      res.status(401).json({
        error: {
          message: "Authentication Failed. Please login again.",
          details: [{ path: "token", message: err.message }],
        },
      });
    }
  };
}



function validateTokenInRequest(req: Request): Promise<string> {
  const authToken = req.get("Authorization");

  if (!authToken) {
    return Promise.reject(new Error("No Auth Token"));
  }

  const authTokenComponents = authToken.split(" ");

  if (
    authTokenComponents.length !== 2 ||
    ["Bearer"].indexOf(authTokenComponents[0]) < 0 ||
    authTokenComponents[1].length === 0
  ) {
    return Promise.reject(new Error("Auth Token in Incorrect Format"));
  }
  return Promise.resolve(authTokenComponents[1]);
}
