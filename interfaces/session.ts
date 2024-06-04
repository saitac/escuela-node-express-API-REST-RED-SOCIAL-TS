import IntUser from "./user"

interface IntSession {
    user: IntUser,
    iat:  number,
    exp: number
}

export default IntSession