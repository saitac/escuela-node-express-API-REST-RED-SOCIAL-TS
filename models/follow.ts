import {Schema, model} from "mongoose"
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

const followModel = model("follow", followSchema, "follows");

export default followModel