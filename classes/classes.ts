import moment  from "moment"
import IntUser from "../interfaces/user"
import IntSession from "../interfaces/session"
import IntFollow from "../interfaces/follow"
import mongoose from "mongoose"

class ClsUser implements IntUser {
    _id?: string
    name: string
    surname: string
    bio: string
    nick: string
    email: string
    password: string
    role?: string
    image?: string
    created_at?: Date

    constructor(_id: string = "", name: string = "", surname: string = "", bio: string = "", nick: string = "", email: string = "", 
    password: string = "", role: string = "", image: string = "", created_at: Date = new Date(Date.now())){
        this._id = _id;
        this.name = name;
        this.surname = surname;
        this.bio = bio;
        this.nick = nick;
        this.email = email;
        this.password = password;
        this.role = role;
        this.image = image;
        this.created_at = created_at;
    }
}

class ClsSession implements IntSession {
    user: ClsUser
    iat: number
    exp: number

    constructor(user: ClsUser = new ClsUser(), iat: number = moment().unix(), exp: number = moment().add(30, "days").unix()) {
        this.user = user;
        this.iat = iat;
        this.exp = exp;
    }
}

class ClsFollow implements IntFollow {
    _id?: string | undefined
    user: mongoose.Types.ObjectId | null
    followed: mongoose.Types.ObjectId | null
    created_at: Date
    
    constructor(_id: string = "", user: mongoose.Types.ObjectId | null = null, followed: mongoose.Types.ObjectId | null  = null, created_at: Date = new Date()) {
        this._id = _id;
        this.user = user;
        this.followed = followed;
        this.created_at = created_at;
    }
}
    
export {
    ClsUser,
    ClsSession,
    ClsFollow
}