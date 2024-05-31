import {Request, Response} from "express"

const publicationPrueba = (req: Request, res: Response) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/publication.ts"
    })
}


export {
    publicationPrueba
}