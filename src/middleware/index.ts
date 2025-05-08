import { Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"
// middleware para gestion de errores
export const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {

    let errors = validationResult(req)

    if(!errors.isEmpty()){  // si hay errores en la validación
        res.status(400).json({errors: errors.array()})   // retorna un json con los errores de validación en el body en formato json
        return
    }
    next();  // termina y continua el flujo del código
    return;
}