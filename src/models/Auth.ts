import mongoose, {Schema, Document } from 'mongoose'

export interface IUser extends Document{
    email: string,
    password: string,
    name: string,
    confirmed: boolean
}

const userSchema: Schema = new Schema({     // esquema de usuario
    email: {        // correo del usuario
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {           // contraseña del usuario
        type: String,
        required: true,
    },
    name: {             // nombre del usuario
        type: String,
        required: true
    },
    confirmed: {        // usuario confirmado
        type: Boolean,
        default: false  // al principio no está confirmado
    }
})

const User = mongoose.model<IUser>('User', userSchema)      // crea un modelo de usuario

export default User;
