import {Request, Response} from "express"

const userPrueba = (req: Request, res: Response) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.ts"
    })
}


export {
    userPrueba
}
