import express, {Router} from "express"
import { followPrueba } from "../controllers/follow";

const followRouter: Router = express.Router();

followRouter.get("/follow/prueba", followPrueba);

export {
    followRouter
}