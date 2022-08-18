import { NextFunction, Response } from "express";
import { inject, injectable } from "inversify";
import { controller, httpPost } from "inversify-express-utils";
import { validate } from "../../middleware/joi.middleware";
import { createJWTToken } from "../../utilities/jwt.utilities";
import { AdminTypes } from "../admin.types";
import { AdminAuthRepository } from "./admin.auth.repository";
import { ILoginAdminRequest, IRegisterAdminRequest, loginAdminSchema, registerAdminSchema } from "./admin.auth.schema";


@injectable()
@controller("/auth")
export class AdminAuthController {

    constructor(
        @inject(AdminTypes.AdminAuthRepository)
        private adminAuthRepo: AdminAuthRepository
    ) { }

    @httpPost("/login", validate(loginAdminSchema))
    async Login(req: ILoginAdminRequest, res: Response, next: NextFunction) {
        try {
            const stat = await this.adminAuthRepo.login(req.body.email, req.body.password);

            const jwtObj = {
                user_type: 'admin',
                access_role: stat.access_role,
                email: stat.email,
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

    @httpPost("/register", validate(registerAdminSchema))
    async Register(req: IRegisterAdminRequest, res: Response, next: NextFunction) {
        try {
            const stat = await this.adminAuthRepo.register(req.body);

            const jwtObj = {
                user_type: 'admin',
                access_role: stat.access_role,
                email: stat.email,
                uid: stat._id,
            };
            const customToken = await createJWTToken(jwtObj, "30d");
            res.status(200).json({
                message: "Sucessfully Register",
                data: { customToken },
            });
            return res;

        } catch (err) {
            return next(err);
        }
    }
}