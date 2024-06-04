import jwt from "jwt-simple"
import moment from "moment"
import IntUser from "../interfaces/user";
import { ClsSession } from "../classes/classes";

// Clave secreta
const secretPassword = "clave#secreta!del2024";

const servCreateToken = (user: IntUser) => {
    let session: ClsSession = new ClsSession(user, moment().unix(), moment().add(30, "days").unix())
    return jwt.encode(session, secretPassword);
}

export {
    servCreateToken,
    secretPassword
}



