import {Request, Response} from "express"
import bcrypt from "bcrypt"
import userModel from "../models/user"
import { servCreateToken } from "../services/jwt"
import IntUser from "../interfaces/user"
import { ClsUser } from "../classes/classes"
import mongoose from "mongoose"

const userPrueba = (req: Request, res: Response) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.ts",
        session: req.body.session
    })
}

const userRegister = async (req: Request, res: Response) => {
    try {
        
        // recoger datoa de la petición
        const parametros = req.body;
        
        // comprobar que me llegan bien (+ validación)
        if ( !(parametros.name && parametros.email && parametros.password && parametros.nick) ) {
            throw new Error("Faltan datos por enviar");
        }

        // crear objeto usuario
        const user_to_save = new userModel(parametros);
        
        // control de usuarios duplicados
        const result = await userModel.find({
            $or: [
                {email: user_to_save.email!.toLowerCase()},
                {nick: user_to_save.nick!.toLowerCase()}
            ]
        }).exec();

        if ( result.length > 0 ) {
            throw new Error("El Usuario ya existe");
        }
        
        // cifrar la contraseña
        user_to_save.password = await bcrypt.hash(<string>user_to_save.password, 10);

        // guardar usuario en la base de datos
        const new_user = await user_to_save.save();
                
        // devolver resultado
        return res.status(200).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: new_user
        })

    } catch (error ) {
        if ( error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }
}

const userLogin = async (req: Request, res: Response) => {
    try {

        // recoger parametros
        const parametros = req.body;
        
        if ( !(parametros.email && parametros.password) ) {
            throw new Error("faltan datos por enviar")
        }
        
        // buscar el usuario en la base de datos
        const result: IntUser | null = await userModel.findOne({email: parametros.email.toLowerCase()});
        // .select({password: 0})
        
        if ( result !== null ) {

            // comprobar la contraseña
            const passCorrect: boolean = await bcrypt.compare(parametros.password, <string>result.password);
            if ( !passCorrect ) {
                throw new Error("No te has identificado correctamente");
            }

            // generar token
            const token = servCreateToken(result);

            // datos del usuario
            return res.status(200).json({
                status: "success",
                message: "Te has identificado correctamente",
                user: {
                    _id: result._id,
                    name: result.name,
                    nick: result.nick,
                },
                token: token
            })

        } else {

            return res.status(200).json({
                status: "success",
                message: "Usuario no encontrado"
            })

        }

    } catch ( error ) {
        if ( error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            })
        }
    }
}

const userProfile = async (req: Request, res: Response) => {
    try{

        const id = req.params.id //new mongoose.Types.ObjectId(id)

        const usuario: ClsUser | null = await userModel.findById(id).select({password: 0, role: 0}).exec();

        if ( usuario === null ) { 
            throw new Error("El usuario no existe");
        }
        
        return res.status(200).json({
            status: "success",
            user: usuario
        })

    } catch( error ) {
        if ( error instanceof Error ) {
            return res.status(400).json({
                status: "error",
                message: error.message
            })
        }

    }
}

const userList = async (req: Request, res: Response) => {
    try {

        console.log(req.params);

        const x = await userModel.find({}).skip(2).exec();
        
        
        
        //https://www.npmjs.com/package/mongoose-paginate-v2
        //https://www.google.com/search?q=mongoose-paginate-v2+examples&rlz=1C1GCEU_esCL930CL930&oq=mongoose-paginate-v2+examples&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg80gEIMjE3MmowajmoAgCwAgE&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:f668f8e4,vid:6hUUOZxVVCo,st:0
        
        // https://www.google.com/search?sca_esv=23c20ded85caa685&rlz=1C1GCEU_esCL930CL930&q=mongoose-paginate-v2+typescript+example&tbm=vid&source=lnms&prmd=visnbmtz&sa=X&ved=2ahUKEwidgq2RkcWGAxWcLbkGHXrhOx0Q0pQJegQIDRAB&biw=1920&bih=953&dpr=1#fpstate=ive&vld=cid:128b0d1c,vid:mARc0pOX4i0,st:0
    
        return res.status(200).json({
            status: "success",
            message: "OK!",
            x
        })

    } catch (error ) {

        if ( error instanceof Error ) {
            return res.status(400).json({
                status: "error",
                message: error.message
            })
        }

    }  
}

export {
    userPrueba,
    userRegister,
    userLogin,
    userProfile,
    userList
}
