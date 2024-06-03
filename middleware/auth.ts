
import {Request, Response, NextFunction} from "express"
import jwt from "jwt-simple"
import moment from "moment"
import { secretPassword } from "../services/jwt"

// función de autenticación

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {

        console.log("HOLA0")

       /* if ( !req.headers.authorization ) {
            throw new Error("La petición no tiene la cabecera de autenticación");
        }*/

        console.log(req.headers.authorization);


        

    }catch( error ) {
        if ( error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }

    console.log("HOLA1")
    next();
}

// comprobar si me llega la cabecera de auth

// decodificar el token

// agregar datos de usuario a request

// pasar a la ejecución de la acción

export {
    auth
}