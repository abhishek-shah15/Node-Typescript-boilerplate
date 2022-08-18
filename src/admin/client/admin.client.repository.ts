import { injectable } from "inversify";
import { ObjectId } from "bson";
import { ClientModel } from "../../model/client.user.model";
import { InvalidInput } from "../../utilities/customError";
import { isNullOrUndefined } from "../../utilities/type-guards";

@injectable()
export class AdminClientRepository {

    async AllClientList() {

        let query: { [k: string]: any } = {
            is_deleted: false,

        };

        const data = await ClientModel.find(query)
        return Promise.resolve(data)
    }

    async ClientDetailsById(clientID: string) {
        let query: { [k: string]: any } = {
            is_deleted: false,
            _id: new Object(clientID)

        };

        const ClientDoc = await ClientModel.findOne(query);

        if (isNullOrUndefined(ClientDoc)) {
            return Promise.reject(
                new InvalidInput('Client Not Found.', 400)
            );
        }
        return ClientDoc;
    }
}