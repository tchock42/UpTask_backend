import mongoose from "mongoose";
import {exit} from 'node:process'
import colors from 'colors'

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASE_URL)
        
        const url = `${connection.connection.host}:${connection.connection.port}`
        console.log(colors.cyan.bold(`MongoDB Conectado en: ${url}`))
    } catch (error) {
        // console.log(error.message)
        console.log(colors.red.bold('Error al conectar a MongoDB'))
        console.error(error);
        exit(1)                 // termina la conexión con error (sale del npm run dev)
    }
}
 