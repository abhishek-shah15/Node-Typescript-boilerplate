import { injectable } from "inversify";
import { ObjectId } from "bson";
import { ClientModel } from "../../model/client.user.model";

@injectable()
export class ClientProfileRepository {

    async profile(user_id: string) {

        let query: { [k: string]: any } = {
            _id: new ObjectId(user_id),
            is_deleted: false,
        };

        const clientDoc = await ClientModel.findOne(query).select("-password");
        return clientDoc;
    }

}