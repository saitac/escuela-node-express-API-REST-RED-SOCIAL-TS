import express, {Router} from "express"
import { userPrueba } from "../controllers/user";

const userRouter: Router = express.Router();

userRouter.get("/user/prueba", userPrueba);

export {
    userRouter
}