import * as Mongoose from "mongoose";

export async function validateDbRecordsWith_id( //Used in vehicle model
  Model: Mongoose.Model<Mongoose.Document>,
  items: [Mongoose.Types.ObjectId]
) {
  for (let i = 0; i < items.length; i++) {
    const loc_id = items[i];
    const locData = await Model.findById(loc_id);
    if (locData === null) {
      return false;
    }
  }
  return true;
}

export function escapeRegExp(str: string) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
