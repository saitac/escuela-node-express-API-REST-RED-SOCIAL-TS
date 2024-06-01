import express, {Router} from "express"
import { userPrueba, userRegister } from "../controllers/user";

const userRouter: Router = express.Router();

userRouter.get("/user/prueba", userPrueba);
userRouter.post("/user/register", userRegister)

export {
    userRouter
}