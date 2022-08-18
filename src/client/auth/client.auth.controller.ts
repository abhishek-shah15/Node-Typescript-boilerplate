import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { validate } from "../../middleware/joi.middleware";
import { createJWTToken } from "../../utilities/jwt.utilities";
import { ClientTypes } from "../client.types";
import { ClientAuthRepository } from "./client.auth.reposity";
import { ILoginClientRequest, loginClientSchema } from "./client.auth.schema";


@injectable()
@controller("/auth")
export class ClientAuthController {

    constructor(
        @inject(ClientTypes.ClientAuthRepository)
        private clientAuthRepo: ClientAuthRepository
    ) { }

    @httpPost("/login", validate(loginClientSchema))
    async Login(req: ILoginClientRequest, res: Response, next: NextFunction) {
        try {
            const stat = await this.clientAuthRepo.login(req.body.unique_id, req.body.password);

            const jwtObj = {
                user_type: 'client',
                unique_id: stat.unique_id,
                uid: stat._id,
            };
            const customToken = await createJWTToken(jwtObj, "30d");
            res.status(200).json({
                message: "Sucessfully Login",
                data: { customToken },
            });
            return res;

        } catch (err) {
            return next(err);
        }
    }
}