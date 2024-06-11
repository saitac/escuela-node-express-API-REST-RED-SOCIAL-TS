import {Request, Response} from "express"
import followModel from "../models/follow"
import { ClsSession } from "../classes/classes"
import IntFollow from "../interfaces/follow"
import mongoose from "mongoose"



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

        return res.status(200).json({
            status: "success",
            message: "OK!"
        });

    } catch ( error ) {
        if (error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }
    }
}


export {
    followPrueba,
    followSave,
    followDelete
}