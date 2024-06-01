import {Request, Response} from "express"
import userModel from "../models/user"

const userPrueba = (req: Request, res: Response) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.ts"
    })
}

const userRegister = (req: Request, res: Response) => {

    // recoger datoa de la petición
    const parametros = req.body;
      
    // comprobar que me llegan bien (+ validación)
    if ( !(parametros.name && parametros.email && parametros.password && parametros.nick) ) {
        
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    // crear objeto usuario
    const user_to_save = new userModel(parametros);

    // control de usuarios duplicados

    // cifrar la contraseña

    // guardar usuario en la base de datos


    // devolver resultado
    return res.status(200).json({
        status: "success",
        message: "Acción de registro de usuario",
        parametros
    })

}


export {
    userPrueba,
    userRegister
}
