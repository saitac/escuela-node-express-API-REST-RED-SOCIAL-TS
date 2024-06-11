import express, {Router} from "express"
import { followDelete, followPrueba, followSave } from "../controllers/follow";
import {auth} from "../middleware/auth"

const followRouter: Router = express.Router();

followRouter.get("/follow/prueba", followPrueba);
followRouter.post("/follow/save", [auth, followSave]);
followRouter.delete("/follow/delete",[auth, followDelete]);

export {
    followRouter
}