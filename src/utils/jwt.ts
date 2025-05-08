import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'

type UserPayload = {        // 
    id: Types.ObjectId
}

export const generateJWT = (payload: UserPayload) => {              // recibe el payload desde Autcontroller
 
    const token = jwt.sign(payload, process.env.JWT_SECRET, {      // generacion de jwt
        expiresIn: '60m'
    })
    return token                    // la funcion retorna el token
}