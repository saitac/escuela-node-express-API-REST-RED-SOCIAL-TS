import express, {Router} from "express"
import { userLogin, userPrueba, userRegister } from "../controllers/user";
import { auth } from "../middleware/auth";

const userRouter: Router = express.Router();

userRouter.get("/user/prueba", [auth, userPrueba]);
userRouter.post("/user/register", userRegister);
userRouter.post("/user/login", userLogin);

export {
    userRouter
}