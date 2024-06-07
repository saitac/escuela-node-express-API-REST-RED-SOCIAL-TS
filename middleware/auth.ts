
import {Request, Response, NextFunction} from "express"
import jwt from "jwt-simple"
import moment from "moment"
import { secretPassword } from "../services/jwt"
import { ClsSession } from "../classes/classes"

// función de autenticación

const auth = (req: Request, res: Response, next: NextFunction) => {
    try {

       if ( !req.headers.authorization ) {
            throw new Error("La petición no tiene la cabecera de autenticación");
        }

        const token: string = req.headers.authorization;
        
        const session: ClsSession = jwt.decode(token, secretPassword);

        // comprobar expiración del token
        if ( session.exp <= moment().unix() ) {
            throw new Error("El token ha expirado");
        }

        // Agregar datos del usuario al body del request
        // req.body.session=session;
                

    }catch( error ) {
        if ( error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }

    next();
}

export {
    auth
}