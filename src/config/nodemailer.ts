// archivo de configuración para nodemailer usado por la clase AuthEmail
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'     // importa las variables de entorno

dotenv.config()         // lee las variables de entorno

const config = () => {                  // crea una constante con la configuracion de nodemailer
    return {
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }
}
export const transporter = nodemailer.createTransport(config())     // exporta transporter para que sea usado para envío de correos