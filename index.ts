import express, {Express, Request, Response} from "express"
import cors from "cors"
import { dbConnection } from "./database/connection";


// Inicializando la aplicación
console.log("Inicializando API - Red Social - TypeScript - Node - Express");

// Conectando a la Base de Datos mi_red_social en MongoDB Atlas
dbConnection();

// Crear Servidor Node
const app: Express = express();
const puerto: number = 3900;

// Configurar el cors para evitar los problemas de direccionamiento cruzado
app.use(cors());

// Convertir body a objeto js. Si le paso datos por medio de una petición POST, lo transforma automáticamente
// a un objeto JS, no sería necesario parsearlo
// Para recibir datos con context-type app/json
app.use(express.json());

 // para parsing application/x-www-form-urlencoded
 app.use(express.urlencoded({extended: true}));

 // ruta de prueba
 app.get("/", (req: Request, res: Response) => {
    res.send("Hola Mundo, TS - Salvasoft");
 });

 // Crear el servidor y escuchar peticiones, es importante pasarle un puerto por donde escuhar las peticiones
 app.listen(puerto, () => {
    console.log("Todo OK!, servidor corriendo...");
 });
