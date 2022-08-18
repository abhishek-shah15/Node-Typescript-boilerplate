import { Request, Response } from "express";
import * as Joi from "joi";

export const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const objectPasswordRegex = /^[a-zA-Z0-9]{6,60}$/;

export interface IRequestSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  user?: Joi.ObjectSchema;
  files?: Joi.ObjectSchema;
}

export async function validateSocketRequest(
  reqData: any,
  schema: any,
  ack: Function
): Promise<any> {
  try {
    return await validateWithPromise(reqData, schema);
  } catch (error) {
    if (typeof ack !== "function") {
      return false;
    }
    ack({
      status_code: 422,
      status: "error",
      message: "Invalid Request.",
      details: error.details.map((err: any) => ({
        path: err.path,
        description: err.message,
      })),
    });
    return false;
  }
}

export function validate(
  schemas: IRequestSchema
): (req: Request, res: Response, next: any) => void {
  return async function (req: any, res: Response, next: any) {
    let promises: Promise<any>[] = [];
    let keysValidated: string[] = [];
    if (schemas.body) {
      console.log("here1");
      console.log(req.body);

      keysValidated.push("body");
      promises.push(validateWithPromise(req.body, schemas.body));
    }

    if (schemas.params) {
      keysValidated.push("params");
      promises.push(validateWithPromise(req.params, schemas.params));
    }

    if (schemas.query) {
      keysValidated.push("query");
      promises.push(validateWithPromise(req.query, schemas.query));
    }

    if (schemas.user) {
      keysValidated.push("user");
      promises.push(validateWithPromise(req.user, schemas.user));
    }
    if (schemas.files) {
      keysValidated.push("files");
      promises.push(validateWithPromise(req.files, schemas.files));
    }

    try {
      const data = await Promise.all(promises);
      keysValidated.forEach((key, index) => {
        req[key] = data[index];
      });
      next();
    } catch (error) {
      res.status(422).json({
        status_code: 400,
        message: "Invalid Request.",
        details: error.details.map((err: any) => ({
          path: err.path,
          description: err.message,
        })),
      });
    }
  };
}
function validateWithPromise(object: any, schema: any): Promise<any> {
  return new Promise((resolve, reject) => {
    Joi.validate(
      object,
      schema,
      { abortEarly: false, allowUnknown: true },
      (err, value) => {
        if (err) {
          return reject(err);
        }
        resolve(value);
      }
    );
  });
}
