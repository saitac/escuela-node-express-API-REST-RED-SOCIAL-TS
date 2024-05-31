import express, {Router} from "express"
import { publicationPrueba } from "../controllers/publication";

const publicationRouter: Router = express.Router();

publicationRouter.get("/publication/prueba", publicationPrueba);

export {
    publicationRouter
}