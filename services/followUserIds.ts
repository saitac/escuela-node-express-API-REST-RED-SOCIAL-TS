
import followModel from "../models/follow"

const followUserIds = async (userId: string) => {
    try{

        let following = await followModel.find({
            user: userId
        })
        .select({_id: 0, __v:0, user:0})
        .exec();

        console.log(following);




    }catch(error){
        console.log(error)
    }
}

const followThisUser = () => {}


exports = {
    followUserIds
}