import {PaginateModel, Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2";

import IntFollow from "../interfaces/follow";

const followSchema = new Schema<IntFollow>({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    followed: {
        type: Schema.ObjectId,
        ref: "User"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

/*const followModel = model("follow", followSchema, "follows");*/

followSchema.plugin(paginate);
const followModel = model<IntFollow, PaginateModel<IntFollow>>("follow", followSchema, "follows");

export default followModel