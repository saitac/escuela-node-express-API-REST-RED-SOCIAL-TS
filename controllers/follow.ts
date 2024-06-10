import {Request, Response} from "express"
import followModel from "../models/follow"
import userModel from "../models/user"



const followPrueba = (req: Request, res: Response) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/follow.ts"
    })
}


export {
    followPrueba
}