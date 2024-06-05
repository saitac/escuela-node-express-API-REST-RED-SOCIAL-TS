import express, {Router} from "express"
import { userList, userLogin, userProfile, userPrueba, userRegister } from "../controllers/user";
import { auth } from "../middleware/auth";

const userRouter: Router = express.Router();

userRouter.get("/user/prueba", [auth, userPrueba]);
userRouter.post("/user/register", userRegister);
userRouter.post("/user/login", userLogin);
userRouter.get("/user/profile/:id", auth, userProfile);
userRouter.get("/user/list/:page?", [auth, userList]);

export {
    userRouter
}