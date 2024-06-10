import IntUser from "./user"

interface  IntFollow {
    _id?: string,
    user: IntUser,
    followed: IntUser,
    created_at?: Date
}

export default IntFollow