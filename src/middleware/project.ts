//middleware para la gestion de projects
import type {Request, Response, NextFunction} from 'express'
import Project, { IProject } from '../models/Project'

declare global{             // declara un espacio global
    namespace Express {         // en el espacio de express
        interface Request{      // en la interfaz de Request
            project: IProject   // agrega la interfaz de proyecto a la interfaz de Request para usarlo en req
        }
    }
}

export async function validateProjectExist(req: Request, res: Response, next: NextFunction){
    try {
        // obtener el id del params
        const {projectId} = req.params
    
        // verificar si el proyecto de la tarea existe
        const project = await Project.findById(projectId)

        if(!project){           // si no se encuentra un projecto
            const error = new Error('Proyecto no encontrado')   // crea un error.message
            res.status(404).json({error: error.message}) // recupera el mensaje de la constante error y lo carga en el json del status 404
            return
        }
        // si se encuentra el project, guarda la referencia del project en req (Request) y pasa al siguiente middleware
        req.project = project
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
} 