import { IAuthenticatedRequest } from "../../middleware/auth-token.middleware";
import { IRequestSchema, objectIdRegex } from "../../middleware/joi.middleware";
import * as Joi from "joi"

// Add Money Schema //
export interface IAddMoney {
    amount: number;
    [k: string]: any;
}

export interface IAddMoneyRequest extends IAuthenticatedRequest {
    body: IAddMoney;
}

export const addMoneySchema: IRequestSchema = {
    body: Joi.object().keys({
        amount: Joi.number().required(),
    }),
};