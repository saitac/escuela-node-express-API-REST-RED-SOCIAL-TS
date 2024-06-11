import mongoose from "mongoose"

interface  IntFollow {
    _id?: string,
    user: mongoose.Types.ObjectId | null,
    followed: mongoose.Types.ObjectId | null,
    created_at?: Date
}

export default IntFollow