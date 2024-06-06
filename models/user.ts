import { PaginateModel, Schema, model} from "mongoose"
import paginate from "mongoose-paginate-v2";
import IntUser from "../interfaces/user";

const userSchema = new Schema<IntUser>({
    /*_id: {
        type: String,
    },*/
    name: {
        type: String,
        require: true
    },
    surname: String,
    bio: String,
    nick: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true   
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        default: "role_user",
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

userSchema.plugin(paginate);

const userModel = model<IntUser, PaginateModel<IntUser>>('User', userSchema, 'users');

export default userModel