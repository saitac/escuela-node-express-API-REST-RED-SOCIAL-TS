import {Request, Response} from "express"
import bcrypt from "bcrypt"
import jwt from "jwt-simple"
import userModel from "../models/user"
import { secretPassword, servCreateToken } from "../services/jwt"
import IntUser from "../interfaces/user"
import { ClsSession, ClsUser } from "../classes/classes"
import { isNumeric } from "validator"

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
                {email: user_to_save.email!}, //.toLowerCase()
                {nick: user_to_save.nick!} //.toLowerCase()
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

        let page: number = 1;

        if ( req.params.page && isNumeric(req.params.page)) {
            page = +req.params.page;
        }

        const paginateOptions = {
            sort: {_id: 1},
            limit: 5,
            page
        };

        const users  = await userModel.paginate({}, paginateOptions);
    
        return res.status(200).json({
            status: "success",
            users
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

const userUpdate = async (req: Request, res: Response) => {
    try {

        // comprobar que me llegan bien (+ validación)
        if ( !(req.body.id && req.body.name && req.body.nick && req.body.email && req.body.password ) ) {
            throw new Error("Faltan datos por enviar");
        }

        const userAactualizar: ClsUser = new ClsUser();
        
        userAactualizar._id = req.body.id !== undefined ? req.body.id : "";
        userAactualizar.name = req.body.name !== undefined ? req.body.name : "";
        userAactualizar.surname = req.body.surname !== undefined ? req.body.surname : "";
        userAactualizar.bio = req.body.bio !== undefined ? req.body.bio : "";
        userAactualizar.nick = req.body.nick !== undefined ? req.body.nick : "" ;
        userAactualizar.email = req.body.email !== undefined ? req.body.email : "" ;
        userAactualizar.password = req.body.password !== undefined ? await bcrypt.hash(<string>req.body.password, 10) : "" ;

        // Valido que el usuario exista en la base de datos
        const usuario: ClsUser | null = await userModel.findById<IntUser>(userAactualizar._id).exec();
        if ( usuario === null ) {
            throw new Error("El usuario no existe en la Base de Datos");
        }

        // Si usuario existe en la base de datos, valido que no exista otro usuario con el mismo nick o email
        const result: ClsUser[] = await userModel.find<IntUser>({
            $and:[
                {
                    _id:{$ne: userAactualizar._id}

                },

                {
                    $or: [{email: userAactualizar.email!}, {nick: userAactualizar.nick!}]
                }

            ]           
        }).exec();

        if ( result.length > 0 ) {
            throw new Error("El email o nick que intenta registrar, ya existe");
        }

        const userUpdated: ClsUser | null = await userModel.findByIdAndUpdate<IntUser>(
            userAactualizar._id,
            {
                name: userAactualizar.name,
                surname: userAactualizar.surname,
                bio: userAactualizar.bio,
                nick: userAactualizar.nick,
                email: userAactualizar.email,
                password: userAactualizar.password
            },
            {new: true}
        );
        
        return res.status(200).json({
            status: "success",
            message: "OK!",
            user: userUpdated
        });

    } catch( error ) {

        if ( error instanceof Error) {
            return res.status(400).json({
                status: "error",
                message: error.message
            });
        }

    }
}

export {
    userPrueba,
    userRegister,
    userLogin,
    userProfile,
    userList,
    userUpdate
}
