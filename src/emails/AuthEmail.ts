// clase AuthMail para el envío de correos de confirmación usado en AuthController
import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string
    name: string
    token: string
}

export class AuthEmail {
    static sendConfirmationEmail = async (user : IEmail) => {
        await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Confirma tu cuenta en UpTask',
            html: `<p>Hola ${user.name}: Has creado tu cuenta en UpTask, ya casi esta todo listo, solo debes confirmar tu cuenta</p>
                <p>Visita el siguiente enlace:  </p>
                <a href="${process.env.FRONTEND_URL}/auth/confirm-account">CONFIRMAR CUENTA</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })
    }
    static sentPasswordResetToken = async (user : IEmail) => {
        await transporter.sendMail({
            from: 'UpTask <admin@uptask.com>',
            to: user.email,
            subject: 'UpTask - Confirma tu cuenta',
            text: 'UpTask - Reestablece tu contraseña en UpTask',
            html: `<p>Hola ${user.name}: Has solicitado reestablecer la contraseña de tu cuenta de UpTask.</p>
                <p>Visita el siguiente enlace para crear una nueva contraseña:  </p>
                <a href="${process.env.FRONTEND_URL}/auth/new-password">RECUPERAR CONTRASEÑA</a>
                <p>E ingresa el código: <b>${user.token}</b></p>
                <p>Este token expira en 10 minutos</p>
            `
        })
    }
}