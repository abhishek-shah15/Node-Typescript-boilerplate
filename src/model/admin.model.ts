import * as Mongoose from "mongoose";


export interface IAdminDoc extends Mongoose.Document {
    full_name: string;
    email: string;
    password: string;
    access_role: string;
    is_active: boolean;
    is_deleted: boolean;
    created_at: Date;
    deleted_at: Date;
    updated_at: Date
}


const mongooseAdminSchema = new Mongoose.Schema(
    {
        full_name: String,
        email: String,
        password: String,
        access_role: String,
        is_active: { type: Boolean, default: true },
        is_deleted: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        deleted_at: Date,
        updated_at: Date
    },
    { collection: "admin", versionKey: false }
);
export const AdminModel: Mongoose.Model<IAdminDoc> = Mongoose.model<
    IAdminDoc
>("admin", mongooseAdminSchema);
