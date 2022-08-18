import { injectable } from "inversify";
import path = require("path");
import { ClientModel } from "../../model/client.user.model";
import { InvalidInput } from "../../utilities/customError";
import { isNullOrUndefined } from "../../utilities/type-guards";
import * as bcrypt from "bcryptjs";
import { ObjectId } from "bson";

const SALT_WORK_FACTOR = 10

@injectable()
export class ClientAuthRepository {

    async login(unique_id: string, password: string) {

        let query: { [k: string]: any } = {
            unique_id: unique_id,
            is_deleted: false,
        };

        const clientDoc = await ClientModel.findOne(query);

        if (isNullOrUndefined(clientDoc)) {
            return Promise.reject(
                new InvalidInput('Invali Unique Id and password.', 400)
            );
        }
        else {

            if (await bcrypt.compare(password, clientDoc.password)) {
                return Promise.resolve(clientDoc)
            }
            else {
                return Promise.reject(
                    new InvalidInput('Invali Unique Id and password.', 400)
                );
            }

        }
    }
}