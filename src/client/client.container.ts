import { Container } from "inversify";
import { TYPE } from "inversify-express-utils";
import { ClientAuthController } from "./auth/client.auth.controller";
import { ClientAuthRepository } from "./auth/client.auth.reposity";
import { ClientTypes } from "./client.types";
import { ClientProfileController } from "./profile/client.profile.controller";
import { ClientProfileRepository } from "./profile/client.profile.repository";


export const clientContainer = new Container();

clientContainer
    .bind(TYPE.Controller)
    .to(ClientAuthController)
    .whenTargetNamed(ClientTypes.ClientAuthController);

clientContainer
    .bind(ClientTypes.ClientAuthRepository)
    .to(ClientAuthRepository)
    .inSingletonScope();

clientContainer
    .bind(TYPE.Controller)
    .to(ClientProfileController)
    .whenTargetNamed(ClientTypes.ClientProfileController);

clientContainer
    .bind(ClientTypes.ClientProfileRepository)
    .to(ClientProfileRepository)
    .inSingletonScope();