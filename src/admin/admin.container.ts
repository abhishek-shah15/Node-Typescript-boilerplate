import { Container } from "inversify";
import { TYPE } from "inversify-express-utils";
import { AdminTypes } from "./admin.types";
import { AdminAuthController } from "./auth/admin.auth.controller";
import { AdminAuthRepository } from "./auth/admin.auth.repository";
import { AdminProfileController } from "./profile/admin.profile.controller";
import { AdminProfileRepository } from "./profile/admin.profile.repository";
import { AdminClientController } from "./client/admin.client.controller";
import { AdminClientRepository } from "./client/admin.client.repository";

export const adminContainer = new Container();

adminContainer
    .bind(TYPE.Controller)
    .to(AdminAuthController)
    .whenTargetNamed(AdminTypes.AdminAuthController);

adminContainer
    .bind(AdminTypes.AdminAuthRepository)
    .to(AdminAuthRepository)
    .inSingletonScope();

adminContainer
    .bind(TYPE.Controller)
    .to(AdminProfileController)
    .whenTargetNamed(AdminTypes.AdminProfileController);

adminContainer
    .bind(AdminTypes.AdminProfileRepository)
    .to(AdminProfileRepository)
    .inSingletonScope();

adminContainer
    .bind(TYPE.Controller)
    .to(AdminClientController)
    .whenTargetNamed(AdminTypes.AdminClientController);

adminContainer
    .bind(AdminTypes.AdminClientRepository)
    .to(AdminClientRepository)
    .inSingletonScope();