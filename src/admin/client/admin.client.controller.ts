import { inject, injectable } from "inversify";
import { NextFunction, Response } from "express";
import { controller, httpGet } from "inversify-express-utils";
import { verifyCustomToken } from "../../middleware/auth-token.middleware";
import { AdminTypes } from "../admin.types";
import { AdminClientRepository } from "./admin.client.repository";

@injectable()
@controller("/client", verifyCustomToken("admin"))
export class AdminClientController {

    constructor(
        @inject(AdminTypes.AdminClientRepository)
        private adminClientRepo: AdminClientRepository
    ) { }

    @httpGet("/all")
    async AllClientList(req: any, res: Response, next: NextFunction) {
        try {
            const stat = await this.adminClientRepo.AllClientList();
            res.status(200).json({
                message: "Sucessfully Get ClientList",
                data: stat,
            });
            return res;
        } catch (err) {
            return next(err);
        }
    }

    @httpGet("/clientbyid/:clientID")
    async ClientDetailsById(req: any, res: Response, next: NextFunction) {
        try {
            const stat = await this.adminClientRepo.ClientDetailsById(req.params.clientID);
            res.status(200).json({
                message: "Sucessfully Get Client-Details",
                data: stat,
            });
            return res;
        } catch (err) {
            return next(err);
        }
    }

}