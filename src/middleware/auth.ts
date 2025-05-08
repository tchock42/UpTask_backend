import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/Auth'

declare global {            // para que el typescript pueda acceder a la variable de entorno
    namespace Express {     // namespace para que el typescript pueda acceder a la variable de entorno
        interface Request { // Request es la interfaz de la peticion no pierde la información que ya tiene Request
            user?: IUser    // ?: para decir que el usuario no es obligatorio
        }
    }
}

// middleware para la verificacion del usuario durante las peticiones
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization
    if(!bearer){
        const error = new Error('No autorizado')
        res.status(401).json({error: error.message})
        return
    }
    const token = bearer.split(' ')[1]          // extrae el token del header de la petición
 
    // verificar el jwt
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)       // verifica que el token del header de la peticion coincida con el de la variable de entorno
        
        if(typeof decoded === 'object' && decoded.id){      // se valida que decoded tenga la propiedad .id del usuario
            const user = await User.findById(decoded.id).select('_id name email')    // busca en la base de datos usando el id seleccionando los campos _id, name y email
            if(user){                           // si el usuario existe
                // console.log(user)
                req.user = user                 // lo guarda en la variable de entorno req
            }else{                                              // si el usuario no existe
                res.status(500).json({error: 'Token no válido'})
            }
            
        }

    } catch (error) {       // si el token tiene error o ha expirado
        res.status(500).json({error: "Token no válido"})
        return
    }
    next()
}