import { injectable } from "inversify";
import path = require("path");
import { ClientModel } from "../../model/client.user.model";
import { InvalidInput } from "../../utilities/customError";
import { isNullOrUndefined } from "../../utilities/type-guards";
import * as bcrypt from "bcryptjs";
import { ObjectId } from "bson";
import { AdminModel } from "../../model/admin.model";
import { IRegister } from "./admin.auth.schema";

const SALT_WORK_FACTOR = 10

@injectable()
export class AdminAuthRepository {

    async login(email: string, password: string) {

        let query: { [k: string]: any } = {
            email: email,
            is_deleted: false,
        };

        const adminDoc = await AdminModel.findOne(query);

        if (isNullOrUndefined(adminDoc)) {
            return Promise.reject(
                new InvalidInput('Invali Email and password.', 400)
            );
        }
        else {

            if (await bcrypt.compare(password, adminDoc.password)) {
                return Promise.resolve(adminDoc)
            }
            else {
                return Promise.reject(
                    new InvalidInput('Invali Email and password.', 400)
                );
            }

        }
    }

    async register(reqData: IRegister) {

        let query: { [k: string]: any } = {
            email: reqData.email,
            is_deleted: false,
        };

        const adminDoc = await AdminModel.findOne(query);

        if (!isNullOrUndefined(adminDoc)) {
            return Promise.reject(
                new InvalidInput('Account already exist', 400)
            );
        }
        else {

            let createDoc = {
                full_name: reqData.full_name.trim(),
                email: reqData.email,
                password: await bcrypt.hash(reqData.password, SALT_WORK_FACTOR),
                access_role: reqData.access_role,
            }

            const doc = new AdminModel(createDoc)
            const newAdminDoc = await doc.save()
            return Promise.resolve(newAdminDoc)
        }
    }
}