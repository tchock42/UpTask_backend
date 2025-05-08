import type { Request, Response } from "express";
import User from "../models/Auth";
import { checkPassword, hashPassword } from "../utils/auth";
import Token from "../models/Token";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController{

    static createAccount = async (req:Request, res: Response) => {
        
        try {
            const { password, email } = req.body;    // extra el password y correo del body
            // revisar si existe el email
            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('El usuario ya está registrado')
                res.status(409).json({error: error.message})     // sale del metodo y retorna respuesta 409 (conflicto )
                return;
            }
            
            const user = new User(req.body);    // crea una instancia de user
            
            // Hash el password
            user.password = await hashPassword(password);       // hash a la contraseña usando funcion dedicada

            // Generar el token
            const token = new Token();
            token.token = generateToken()
            token.user = user.id

            // enviar email de confirmacion
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            // guardan en la base de datos
            await Promise.allSettled([user.save(), token.save()])   // realiza ambas consultas al mismo tiempo
            res.send('Cuenta creada, revisa tu email para confirmarla');

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) 
        }
    }
    static confirmAccount = async (req:Request, res: Response) => {

        try {
            const {token} = req.body;
            
            // verificar que el token existe
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists){
                const error = new Error('Token no válido')
                res.status(404).json({error: error.message})        // 404 token no encontrado
                return;
            }
            // si existe el token se busca al usuario para actualizar su confirmed
            const user = await User.findById(tokenExists.user)      // usa el id del usuario para buscarlo
            user.confirmed = true                                   // actualiza el usuario

            await Promise.allSettled([
                user.save(),
                tokenExists.deleteOne()
            ])
            res.send('Cuenta confirmada correctamente');
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    // autenticacion
    static login = async (req: Request, res: Response) => {
        try {
            // verificar que el usuario existe
            const {email, password} = req.body
            const user = await User.findOne({email})

            if(!user){                              // si no existe un usuario
                const error = new Error('Cuenta de correo no registrada')       // genera un error
                res.status(404).json({error: error.message})                // error 404 usuario no encontrado
                return;                                                     // sale del método
            }

            if(!user.confirmed){        // si no está confirmado, se genera un nuevo token para que se valide el usuario. Si aun existiera un token se sobreescribe
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                 // enviar email de confirmacion
                AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })

                const error = new Error('El usuario no verificado. Revisa tu correo para activar tu cuenta')
                res.status(401).json({error: error.message})                // error 401 autenticación invalida
                return
            }
            
            // revisar contraseña
            const isPasswordCorrect = await checkPassword(password, user.password) // revisa la contraseña ingresada con la contraseña guardada
            
            if(!isPasswordCorrect){
                const error = new Error('Contraseña incorrecta')
                res.status(401).json({error: error.message})
                return
            }

            // Autenticado...
            // res.send('Usuario Autenticado')
            const token = generateJWT({id: user.id})
            res.send(token)

        } catch (error) {
            res.status(500).json({error: 'Hubo un error al iniciar sesión'})
        }
    }
    static requestConfirmationToken = async (req:Request, res: Response) => {   
        try {
            const { email } = req.body;    // extra el correo del body
            // revisar si existe el email
            const user= await User.findOne({email})
            if(!user){        // si no existe, no se puede enviar otro token de confirmación
                const error = new Error('El usuario no está registrado')
                res.status(404).json({error: error.message})     // sale del metodo y retorna respuesta 409 (conflicto )
                return;
            }
            // si el suario ya está confirmado
            if(user.confirmed){        
                const error = new Error('El usuario ya está confirmado')
                res.status(403).json({error: error.message})     //403 server entiende petición pero la rechaza
                return;
            }
            // Generar el nuevo token
            const token = new Token();
            token.token = generateToken()
            token.user = user.id

            // enviar email de confirmacion
            AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            // guardan en la base de datos
            await Promise.allSettled([user.save(), token.save()])   // realiza ambas consultas al mismo tiempo
            res.send('Revisa tu bandeja de entrada para ver tu nuevo token');

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) 
        }
    }
    static forgetPassword = async (req:Request, res: Response) => {
        try {
            const { email } = req.body;    // extra el password y correo del body
            // revisar si existe el email
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('El usuario no está registrado')
                res.status(404).json({error: error.message})     // sale del metodo y retorna respuesta 409 (conflicto )
                return;
            }
            
            // Generar el token
            const token = new Token();
            token.token = generateToken();
            token.user = user.id;
            await token.save();

            // enviar email de confirmacion
            AuthEmail.sentPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })
            
            res.send('Se envío un nuevo token a tu correo electrónico para recuperar tu contraseña.');

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) 
        }
    }
    static validateToken = async (req:Request, res: Response) => {

        try {
            const {token} = req.body;
            
            // verificar que el token existe
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists){
                const error = new Error('Token no válido')
                res.status(404).json({error: error.message})        // 404 token no encontrado
                return;
            }

            res.send('Token válido, define tu nueva contraseña');
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static updatePasswordWithToken = async (req: Request, res: Response) => {
        try {
            const {token} = req.params;
            const {password} = req.body
            
            // verificar que el token existe
            const tokenExists = await Token.findOne({token})
            
            if(!tokenExists){
                const error = new Error('Token no válido')
                res.status(404).json({error: error.message})        // 404 token no encontrado
                return;
            }
            const user = await User.findById(tokenExists.user)      // busca usando el id del usuario
            user.password = await hashPassword(password)
            await Promise.allSettled([user.save(), tokenExists.deleteOne()])    // guarda el usuario con la nueva contraseña y elimina el token
            res.send('La contraseña se ha actualizado correctamente');
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    static user = async (req: Request, res: Response) => {
        res.json(req.user)                           // retorna la información del usuario
        return
    }

    // actualizacion del correo y no
    static updateProfile = async (req: Request, res: Response) => {
        const {name, email} = req.body  // extrae del formulario
        // actualiza al usuario
        req.user.name = name
        req.user.email = email
        const userExists = await User.findOne({email})  // busca por un usuario registrado con el email del input
        if(userExists && userExists.id.toString() !== req.user.id.toString()){
            const error = new Error('El correo ingresado ya está registrado')
            res.status(409).json({error: error.message})
            return
        }

        try {
            await req.user.save()       // guarda en la base de datos
            res.send('Perfil de usuario actualizado correctamente')
        } catch (error) {
            res.status(500).send('Hubo un error')
        }
    }
    static updateCurrentPassword = async (req: Request, res: Response) => {
        const {current_password, password} = req.body
        
        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect){
            const error = new Error('La contraseña actual es incorrecta')       // si se ingresa la contraseña incorrecta
            res.status(401).json({error: error.message})
            return                                                              // sale del metodo
        }

        try {
            user.password = await hashPassword(password)    // hashea la nueva contraseña
            await user.save()                               // la guarda en la base de datos
            res.send('La contraseña se ha cambiado correctamente')
        } catch (error) {
            console.log(error)
            res.status(500).send('Hubo un error')
        }
    }
    // verificar contraseña para eliminar proyecto
    static checkPassword = async (req: Request, res: Response) => {
        const {password} = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(password, user.password)

        if(!isPasswordCorrect){
            const error = new Error('La contraseña es incorrecta')
            res.status(401).json({error: error.message})
            return
        }
        res.send('Contraseña correcta')
    }
}