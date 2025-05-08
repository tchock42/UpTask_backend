import mongoose, {Schema, Document, Types, Date } from 'mongoose'

export interface IToken extends Document{           // interface para el token
    token: string,              // dato para validar correo
    user: Types.ObjectId,       // tipo de dato de id del mongodb
    createdAt: Date             // sobreescribe el createdAt de mongodb
}

const tokenSchema : Schema = new Schema({
    token: {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'             // referencia al modelo de Usuario
    },
    createdAt: {                
        type: Date,
        default: Date.now,
        index: {
            expires: '10m'
        }       
    }
})

// creacion de modelo
const Token = mongoose.model<IToken>('Token', tokenSchema)
export default Token;