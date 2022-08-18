import { IAuthenticatedRequest } from "../../middleware/auth-token.middleware";
import { IRequestSchema, objectIdRegex } from "../../middleware/joi.middleware";
import * as Joi from "joi"
import { UploadedFile } from "express-fileupload";

// Login Schema //
export interface ILogin {
    unique_id: string;
    password: string;
    [k: string]: any;
}

export interface ILoginClientRequest extends IAuthenticatedRequest {
    body: ILogin;
}

export const loginClientSchema: IRequestSchema = {
    body: Joi.object().keys({
        unique_id: Joi.string().required(),
        password: Joi.string().required(),
    }),
};