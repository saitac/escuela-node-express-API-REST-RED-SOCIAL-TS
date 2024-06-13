import express, {Router} from "express"
import { followDelete, followFollowers, followFollowing, followPrueba, followSave } from "../controllers/follow";
import {auth} from "../middleware/auth"

const followRouter: Router = express.Router();

followRouter.get("/follow/prueba", followPrueba);
followRouter.post("/follow/save", [auth, followSave]);
followRouter.delete("/follow/delete",[auth, followDelete]);
followRouter.get("/follow/following/:id?/:page?", [auth, followFollowing]);
followRouter.get("/follow/followers/:id?/:page?", [auth, followFollowers]);

export {
    followRouter
}