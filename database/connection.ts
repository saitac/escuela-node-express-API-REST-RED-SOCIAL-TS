import mongoose from "mongoose"

const dbConnection = async() => {
    try {
        await mongoose.connect("mongodb+srv://admin:saitac897@cluster0.hwox04d.mongodb.net/mi_red_social");
        console.log("Conectado correctamente a BD mi_red_social");
    }catch( e ){
        console.log(e);
        throw new Error("No se ha podido conectar a la Base de Datos")
    }
}

export {
    dbConnection
}
