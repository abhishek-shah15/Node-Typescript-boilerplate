import { inject, injectable } from "inversify";
import { NextFunction, Response } from "express";
import { controller, httpGet, httpPost } from "inversify-express-utils";
import { verifyCustomToken } from "../../middleware/auth-token.middleware";
import { ClientTypes } from "../client.types";
import { ClientProfileRepository } from "./client.profile.repository";
import { validate } from "../../middleware/joi.middleware";
import { addMoneySchema, IAddMoneyRequest } from "./client.profile.schema";

@injectable()
@controller("/profile", verifyCustomToken("client"))
export class ClientProfileController {

    constructor(
        @inject(ClientTypes.ClientProfileRepository)
        private clientProfileRepo: ClientProfileRepository
    ) { }

    @httpGet("/own")
    async Profile(req: any, res: Response, next: NextFunction) {
        try {
            const stat = await this.clientProfileRepo.profile(req.user.uid);
            res.status(200).json({
                message: "Sucessfully Get Profile",
                data: stat,
            });
            return res;

        } catch (err) {
            return next(err);
        }
    }

}