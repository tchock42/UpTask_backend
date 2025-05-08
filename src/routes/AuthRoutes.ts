import { Router } from 'express'
import { AuthController } from '../controllers/AuthController';
import { body, param } from 'express-validator';
import { handleInputErrors } from '../middleware';
import { authenticate } from '../middleware/auth';

const router = Router()         // crea una instancia de Router

router.post('/create-account',  // crea una ruta para crear una cuenta
    
    body('name')
        .notEmpty().withMessage('El nombre no puede estar vacío'),
    body('password')
        .isLength({min: 8}).withMessage('El password debe contener al menos 8 carácteres'),
    body('password_confirmation').custom((value, {req}) => {    // value es el valor del password_confirmation, req es el objeto que contiene la información de la petición
        if(value !== req.body.password){
            throw new Error('Las contraseñas deben ser iguales')    // si no se cumple la comparación, lanza un error
        }
        return true;            // retorna true y continua el flujo si se cumple la comparación
    }),
    body('email')
        .isEmail().withMessage('Correo electrónico no válido'),
    handleInputErrors,              // middleware para recuperar errores
    AuthController.createAccount   // controlador
)

router.post('/confirm-account',                 // crea una ruta para confirmar la cuenta
    body('token')
        .notEmpty().withMessage('El token no puede estar vacío'),
    handleInputErrors,
    AuthController.confirmAccount
)

// autenticación
router.post('/login', 
    body('email')
        .isEmail().withMessage('El correo no es válido'),
    body('password')
        .notEmpty().withMessage('La contraseña no es válida'),
    handleInputErrors,
    AuthController.login

)

// enviar un nuevo token
router.post('/request-code',
    body('email')
        .isEmail().withMessage('El correo no es válido'),
    handleInputErrors,
    AuthController.requestConfirmationToken
)

// recuperar contraseña
router.post('/forget-password',
    body('email')
        .isEmail().withMessage('El correo no es válido'),
    handleInputErrors,
    AuthController.forgetPassword
)

// validacion del token para actualizar contraseña
router.post('/validate-token',                 // crea una ruta ingresar el token y generar una nueva contraseña
    body('token')
        .notEmpty().withMessage('El token no puede estar vacío'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/update-password/:token',
    param('token')
        .isNumeric().withMessage('El token no es válido'),
    body('password')
        .isLength({min:8}).withMessage('La contraseña debe tener al meno 8 carácteres'),
    body('password_confirmation').custom((value, {req}) => {        // validacion contraseñas iguales
        if (value !== req.body.password) {
            throw new Error('Las contraseñas no son iguales')
        }
        return true
    }),
    handleInputErrors,
    AuthController.updatePasswordWithToken
)

// endpoint para el usuario
router.get('/user', 
    authenticate,
    AuthController.user
)


/** Perfil*/
// cambiar correo y nombre
router.put('/profile',  
    authenticate,               // verifica la autenticacion del usuario con el token y guarda la
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacío'),
    body('email')
        .isEmail().withMessage('El correo no es válido'),
    handleInputErrors,
    AuthController.updateProfile
)

// cambiar contraseña
router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('La contraseña actual no puede ir vacía'),
    body('password')
        .isLength({min: 8}).withMessage('La contraseña es muy corta, debe tener al menos 8 carácteres'),
    body('password_confirmation').custom((value, {req}) => {        // toma el input actual y el req
        if(value !== req.body.password){                            // y evalua si el input actual es igual que el anterior
            throw new Error('Las contraseñas no son iguales')
        }
        return true                                                 // si son iguales retorna true y continua el flujo
    }),
    handleInputErrors,
    AuthController.updateCurrentPassword
)

// verificar la contraseña para poder eliminar proyectos
router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('La contraseña no puede ir vacía'),
    handleInputErrors,
    AuthController.checkPassword
)
export default router;