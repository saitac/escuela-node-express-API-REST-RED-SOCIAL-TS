import express, {Router} from "express"
import multer from "multer"
import { userAvatar, userList, userLogin, userProfile, userPrueba, userRegister, userUpdate, userUpload } from "../controllers/user";
import { auth } from "../middleware/auth";

const userRouter: Router = express.Router();

const multerStorage = multer.diskStorage({
    destination: (req, file: Express.Multer.File, cb) => {
        cb(null, "./uploads/avatars/");
    },
    filename: (req , file: Express.Multer.File, cb) => {
        cb(null, `avatar-${Date.now()}-${file.originalname}`);
    }
});

const multerUploads = multer({storage: multerStorage});

userRouter.get("/user/prueba", [auth, userPrueba]);
userRouter.post("/user/register", userRegister);
userRouter.post("/user/login", userLogin);
userRouter.get("/user/profile/:id", auth, userProfile);
userRouter.get("/user/list/:page?", [auth, userList]);
userRouter.put("/user/update", [auth, userUpdate]);
userRouter.post("/user/upload", [auth, multerUploads.single("file0"), userUpload]);
userRouter.get("/user/avatar/:file",[auth, userAvatar])

export {
    userRouter
}