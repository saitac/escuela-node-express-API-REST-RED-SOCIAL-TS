import {Request, Response} from "express"
import followModel from "../models/follow"
import { ClsFollow, ClsSession } from "../classes/classes"
import IntFollow from "../interfaces/follow"
import mongoose, { PaginateModel, Schema, model } from "mongoose"
import { isNumeric } from "validator"
import { followThisUser, followUserIds } from "../services/followService"



const followPrueba = (req: Request, res: Response) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.ts"
    })
}

const followSave = (req: Request, res: Response) => {
    try {

        // validar que se envía el parámetro necesario
        const params = req.body;

        if ( !params.followed ) {
            throw new Error("Faltan parámetros en la consulta");
        }

        // obtener el usuario identificado
        const session: ClsSession = JSON.parse(<string>req.headers.session);

        // crear objeto con modelo follow
        let newFollowed: mongoose.Document<unknown, {}, IntFollow> & IntFollow & Required<{_id: string}> | null = null;
        
        if ( session.user._id) {
            newFollowed = new followModel<IntFollow>({
                user: new mongoose.Types.ObjectId(session.user._id),
                followed: new mongoose.Types.ObjectId(<string>params.followed)

            });

            newFollowed.save().then(savedDoc => {
                return res.status(200).json({
                    status: "success",
                    message: "Documento guardado correctamente",
                    savedDoc
                })
            })

        } else {
            throw new Error("No se encuentra el Id de usuario");
        }


    } catch ( error ) {

        if ( error instanceof Error ) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

    }
}

const followDelete = (req: Request, res: Response) => {
    try {

        // obtengo el body
        const params = req.body;

        // valido si llega el parámetro followed que contiene el id del followed a eliminar
        if (!params.followed) {
            throw new Error("Faltan parámetros en la consulta");
        }

        // obtener el usuario identificado
        const session: ClsSession = JSON.parse(<string>req.headers.session);

        // busco y eliminto el registro
        followModel.findOneAndDelete({
            $and:[
                {user: session.user._id},
                {followed: params.followed}
            ]           
        }).exec()
        .catch( error => {
            return res.status(400).json({
                status: "error",
                message: "Se produjo un error al intentar eliminar el registro",
            });
        })
        .then( document => {
            let mensaje: string = "";
            if (!document) {
                mensaje = "Documento no encontrado"
            } else {
                mensaje = "Documento eliminado correctamente"
            }

            return res.status(200).json({
                status: "success",
                message: mensaje,
                document
            });
        })

    } catch ( error ) {
        if (error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
}

// a quien sigo
const followFollowing = (req: Request, res: Response) => {
    try{

        // Obtener la sesion del usuario identificado
        const session: ClsSession = JSON.parse(<string>req.headers.session);
        
        if (!(session.user)){
            throw new Error("Hay un error con la sesión del usuario");
        }

        // Obtener el Id del usuario de la sesión
        let userId: string | undefined = session.user._id

        // comprobar si me llega el id de usuario por la url como parámetro, si es así actualizo la variable
        // userId
        if ( req.params.id ) {
            userId = req.params.id;
        }

        // comprobar si llega la página
        let page: number = 1;
        if ( req.params.page && isNumeric(req.params.page) ) {
            page = +req.params.page;
        }

        // usuarios por página que quiero mostrar
        const itemsPerPage: number = 5;

        // pagination options
        const paginateOptions = {
            sort: {_id: 1},
            limit: itemsPerPage,
            populate: [
                {path: "user", select: "-password -role -__v"},
                {path: "followed", select: "-password -role -__v"}
            ],
            page
        }

        followModel.paginate({
            user: userId
        }, paginateOptions)
        .catch(error => {
            return res.status(400).json({
                status:"error",
                message:error.message
            });
        })
        .then(followings => {
            return res.status(200).json({
                status:"success",
                mensaje:"Listado de usuarios a los que sigo",
                followings
            });
        });

    }catch(error){
        if (error instanceof Error){
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
}

// quien me sigue
const followFollowers = (req: Request, res: Response) => {
    try{

        // Obtener la sesion del usuario identificado
        const session: ClsSession = JSON.parse(<string>req.headers.session);

        if (!(session.user)){
            throw new Error("Hay un error con la sesión del usuario");
        }

        // Obtener el Id del usuario de la sesión
        let userId: string | undefined = session.user._id

        // comprobar si me llega el id de usuario por la url como parámetro, si es así actualizo la variable
        // userId
        if ( req.params.id ) {
            userId = req.params.id;
        }

        // comprobar si llega la página
        let page: number = 1;
        if ( req.params.page && isNumeric(req.params.page) ) {
            page = +req.params.page;
        }

        // usuarios por página que quiero mostrar
        const itemsPerPage: number = 5;

        // pagination options
        const paginateOptions = {
            sort: {_id: 1},
            limit: itemsPerPage,
            populate: [
                {path: "user", select: "-password -role -__v"},
                {path: "followed", select: "-password -role -__v"}
            ],
            page
        }

        followModel.paginate({
            followed: userId
        }, paginateOptions)
        .catch(error => {
            return res.status(400).json({
                status:"error",
                message:error.message
            });
        })
        .then(followers=>{
            return res.status(200).json({
                status:"success",
                mensaje:"Listado de usuarios que me siguen",
                followers
            });
        });

    }catch(error){
        if (error instanceof Error){
            return res.status(400).json({
                status:"error",
                message:error.message
            });
        }
    }

}

const followFollowingAndFollowFollowers = async (req: Request, res: Response) => {
    try{

        // Obtener la sesion del usuario identificado
        const session: ClsSession = JSON.parse(<string>req.headers.session);

        if (!(session.user)){
            throw new Error("Hay un error con la sesión del usuario");
        }

        // Obtener el Id del usuario de la sesión
        let userId: string | undefined = session.user._id

        // comprobar si me llega el id de usuario por la url como parámetro, si es así actualizo la variable
        // userId
        if ( req.params.id ) {
            userId = req.params.id;
        }

        if ( !userId ) {
            throw new Error("No se especificó un usuario");
        }

        let follow_User_Ids = await followUserIds(userId);

        return res.status(200).json({
            status: "success",
            followings: follow_User_Ids.followings,
            followers: follow_User_Ids.followers
        });

        

        /*

        // Obtengo los followings y los followed
        let followings_list: String[] = [];
        let followers_list: String[] = [];

        // pagination options
        const paginateOptionsFollowings = {
            sort: {_id: 1},
            select: {followed: 1, _id: 0}
        };

        const paginateOptionsFollowers = {
            sort: {_id: 1},
            select: {user: 1, _id: 0}
        }

        followModel.find<PaginateModel<ClsFollow>>({
            user: userId
        }).select({
            followed: 1,
            _id: 0
        }).catch(error=>{
            return res.status(400).json({
                status:"error",
                message:error.message
            });
        }).then((followings: PaginateModel<ClsFollow, {}, {}>[] | Response<any, Record<string, any>>)=>{

            if ( followings instanceof Array ) {
                
                followings.forEach( ( f: mongoose.PaginateModel<ClsFollow> ) => {

                    const clsf: ClsFollow = JSON.parse(JSON.stringify(f));
                    
                    if ( clsf.followed ) {
                        followings_list.push(clsf.followed.toString());
                    }
                    
                });

            }

            followModel.find<PaginateModel<ClsFollow>>({
                followed: userId
            }).select({
                user: 1,
                _id: 0
            }).catch(error=>{
                return res.status(400).json({
                    status:"error",
                    message:error.message
                });
            }).then( (followers: PaginateModel<ClsFollow, {}, {}>[] | Response<any, Record<string, any>>) => {

                if ( followers instanceof Array ) {
                
                    followers.forEach( ( f: mongoose.PaginateModel<ClsFollow> ) => {
    
                        const clsf: ClsFollow = JSON.parse(JSON.stringify(f));
                        
                        if ( clsf.user ) {
                            followers_list.push(clsf.user.toString());
                        }
                        
                    });
    
                }

                return res.status(200).json({
                    status:"success",
                    followings: followings_list,
                    followers: followers_list
                })
            })
        });

        */


    }catch(error){
        if ( error instanceof Error ) {
            return res.status(400).json({
                status:"error",
                message:error.message
            });
        }
    }
}



export {
    followPrueba,
    followSave,
    followDelete,
    followFollowing,
    followFollowers,
    followFollowingAndFollowFollowers
}