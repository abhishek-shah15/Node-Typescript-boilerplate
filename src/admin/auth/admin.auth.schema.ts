import { IAuthenticatedRequest } from "../../middleware/auth-token.middleware";
import { IRequestSchema, objectPasswordRegex } from "../../middleware/joi.middleware";
import * as Joi from "joi"

// Login Schema //
export interface ILogin {
    email: string;
    password: string;
    [k: string]: any;
}

export interface ILoginAdminRequest extends IAuthenticatedRequest {
    body: ILogin;
}

export const loginAdminSchema: IRequestSchema = {
    body: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().min(6).max(60).required(),
    }),
};


// Register Schema //
export interface IRegister {
    full_name: string;
    email: string;
    password: string;
    access_role: string;
    [k: string]: any;
}

export interface IRegisterAdminRequest extends IAuthenticatedRequest {
    body: IRegister;
}

export const registerAdminSchema: IRequestSchema = {
    body: Joi.object().keys({
        full_name: Joi.string().trim().min(3).max(30).required(),
        email: Joi.string().required(),
        password: Joi.string().min(6).max(60).required(),
        access_role: Joi.string().valid("full", "read_only").required(),
    }),
};