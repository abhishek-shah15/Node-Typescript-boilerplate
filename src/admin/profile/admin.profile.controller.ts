import { inject, injectable } from "inversify";
import { NextFunction, Response } from "express";
import { controller, httpGet, httpPatch } from "inversify-express-utils";
import { verifyCustomToken } from "../../middleware/auth-token.middleware";
import { AdminProfileRepository } from "./admin.profile.repository";
import { AdminTypes } from "../admin.types";

@injectable()
@controller("/profile", verifyCustomToken("admin"))
export class AdminProfileController {

    constructor(
        @inject(AdminTypes.AdminProfileRepository)
        private adminProfileRepo: AdminProfileRepository
    ) { }

    @httpGet("/own")
    async Profile(req: any, res: Response, next: NextFunction) {
        try {
            const stat = await this.adminProfileRepo.profile(req.user.uid);
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