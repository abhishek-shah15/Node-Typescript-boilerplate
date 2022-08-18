import { injectable } from "inversify";
import { ObjectId } from "bson";
import { AdminModel } from "../../model/admin.model";
import { isNullOrUndefined } from "../../utilities/type-guards";
import { InvalidInput } from "../../utilities/customError";
import * as bcrypt from "bcryptjs";
const SALT_WORK_FACTOR = 10
@injectable()
export class AdminProfileRepository {

    async profile(user_id: string) {

        let query: { [k: string]: any } = {
            _id: new ObjectId(user_id),
            is_deleted: false,
        };

        const adminDoc = await AdminModel.findOne(query);
        return adminDoc;
    }

}