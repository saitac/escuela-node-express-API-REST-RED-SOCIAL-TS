import {Request, Response, json} from "express"
import followModel from "../models/follow"
import { ClsSession } from "../classes/classes"
import IntFollow from "../interfaces/follow"
import mongoose from "mongoose"
import { Schema } from "mongoose"
import IntSession from "../interfaces/session"
import { isNumeric } from "validator"



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
                mensaje:"Listado de usuarios que me siguen",
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

        return res.status(200).json({
            status:"success",
            mensaje:"followFollowed"
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


export {
    followPrueba,
    followSave,
    followDelete,
    followFollowing,
    followFollowers
}