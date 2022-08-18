import * as Mongoose from "mongoose";


export interface IClientDoc extends Mongoose.Document {
    full_name: string;
    unique_id: string;
    password: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    deleted_at: Date;
    updated_at: Date;
    [key: string]: any;
}


const mongooseClientSchema = new Mongoose.Schema(
    {
        full_name: String,
        unique_id: String,
        password: String,
        is_active: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        deleted_at: Date,
        updated_at: Date
    },
    { collection: "client", versionKey: false }
);
export const ClientModel: Mongoose.Model<IClientDoc> = Mongoose.model<
    IClientDoc
>("client", mongooseClientSchema);
