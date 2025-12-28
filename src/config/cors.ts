import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {    // origin de la conexion al backend, funcion que permite la conexión
        const whitelist= [process.env.FRONTEND_URL]

        if(process.argv[2] === '--api'){
            whitelist.push(undefined)   // si se ejecuta desde el backend permite la conexion
        }
        if(whitelist.includes(origin)){
            callback(null, true)        // permite conexión
        }else{
            callback(new Error('Error de CORS'))
        }
    }
}