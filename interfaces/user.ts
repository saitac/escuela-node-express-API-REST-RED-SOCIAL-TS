
interface IntUser {
    _id?: string,
    name: string,
    surname: string,
    nick: string,
    email: string,
    password: string,
    role?: string,
    image?: string,
    created_at?: Date
}

export default IntUser