import express from "express"
import dotenv from 'dotenv'
import {connectDB} from "./config/db"
import AuthRoutes from './routes/AuthRoutes'
import projectRoutes from './routes/projectRoutes'
import cors from 'cors'
import { corsConfig } from "./config/cors"
import morgan from "morgan"

dotenv.config()         // carga la información del .env

connectDB()             // conecta con la base de datos

const app = express()   // Creación de la instancia de Express para el servidor

app.use(cors(corsConfig))   // conexión entre backend y frontend
app.use(morgan('dev'))
app.use(express.json()) // habilitar la lectura de formato json

// Rutas
app.use('/api/auth', AuthRoutes) // Definir la ruta empieza con /api/routh para los usuarios en la API | use soporta todas las peticiones http
app.use('/api/projects', projectRoutes)  // Definir la ruta para los proyectos en la API | use soporta todas las peticiones http

export default app