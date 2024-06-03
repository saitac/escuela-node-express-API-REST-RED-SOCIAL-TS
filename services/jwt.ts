import jwt from "jwt-simple"
import moment from "moment"
import IntUser from "../interfaces/user";

// Clave secreta
const secretPassword = "clave#secreta!del2024";

const servCreateToken = (user: IntUser) => {
    const payload = {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };

    return jwt.encode(payload, secretPassword);
}

export {
    servCreateToken,
    secretPassword
}



