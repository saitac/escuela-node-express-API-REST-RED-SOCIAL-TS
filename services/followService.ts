import { PaginateModel } from "mongoose";
import followModel from "../models/follow"
import { ClsFollow } from "../classes/classes";

const followUserIds = async (identityUserId: string) => {
    let followings_list: String[] = [];
    let followers_list: String[] = [];
    
    try{

        identityUserId = "665bbe3ce58c910ccb4cdcfd";

        //A quien sigo
        let followings: PaginateModel<ClsFollow, {}, {}>[] = await followModel.find<PaginateModel<ClsFollow>>({
            user: identityUserId
        }).select({
            followed: 1,
            _id: 0
        }).exec();
        
        //Quién me sigue
        let followers: PaginateModel<ClsFollow, {}, {}>[] = await followModel.find<PaginateModel<ClsFollow>>({
            followed: identityUserId
        }).select({
            user: 1,
            _id: 0
        }).exec();
        
        followings.forEach( (f: PaginateModel<ClsFollow>) => {
            const clsf: ClsFollow = JSON.parse(JSON.stringify(f));
            if ( clsf.followed ) {
                followings_list.push(clsf.followed.toString());
            }
        });

        followers.forEach( (f: PaginateModel<ClsFollow>) => {
            const clsf: ClsFollow = JSON.parse(JSON.stringify(f));
            if ( clsf.user ) {
                followers_list.push(clsf.user.toString());
            }
        });

        return {
            status: "success",
            followings: followings_list,
            followers: followers_list
        };

    } catch(error){

        return {
            status: "error",
            followings: followings_list,
            followers: followers_list
        };
    }
}


const followThisUser = async (identityUserId: string, profileUserId: string) => {
    try{
        
        /*
        identityUserId = "665bbe3ce58c910ccb4cdcfd";
        profileUserId = "6660af309680073d61af77ac"; //"66620bc9ccdeea582e23f01b"; //"6660af309680073d61af77ac"
        */

        // comprobar si identityUserId esta siguiendo a profileUserId
        let following = await followModel.findOne({
            user: identityUserId,
            followed: profileUserId
        }).exec();

        // comprobar si profileUserId sigue a identityUserId
        let follower = await followModel.findOne({
            user: profileUserId,
            followed: identityUserId
        }).exec();

        return {
            following,
            follower
        }

    }catch(error){
        if ( error instanceof Error ) {
            return {
                status:"error",
                message:error.message
            }
        }
    }
}


export {
    followUserIds,
    followThisUser
}