//middleware para la gestion de tasks
import type {Request, Response, NextFunction} from 'express'
import Task, { ITask } from '../models/Task'     // importa el modelo de proyecto y la interfaz de tarea

declare global{             // declara un espacio global
    namespace Express {         // en el espacio de express
        interface Request{      // en la interfaz de Request con 
            task: ITask         // agrega la interfaz de tarea a la interfaz de Request para usarlo en req
        }
    }
}

export async function validateTaskExist(req: Request, res: Response, next: NextFunction){
    try {
        // obtener el id del params
        const {taskId} = req.params
    
        // verificar si el proyecto de la tarea existe
        const task = await Task.findById(taskId)

        if(!task){           // si no se encuentra la tarea
            const error = new Error('Tarea no encontrada')   // crea un error.message
            res.status(404).json({error: error.message}) // recupera el mensaje de la constante error y lo carga en el json del status 404
            return
        }
        // si se encuentra el project, guarda la referencia del project en req (Request) y pasa al siguiente middleware
        req.task = task
        next()
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
} 

export function taskBelongsToProject(req: Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()){   // si el proyecto no coincide con la tarea
        const error = new Error('Acción no válida')
        res.status(400).json({error: error.message})        // retorna un error y no sigue con la ejecución
                                              
        return
    }
    next()  // no se ejecuta el if y pasa al siguiente middleware / controlador
}

// verifica que el usuario actual esté autorizado para modificar, crear o eliminar tareas
export function hasAuthorization(req: Request, res: Response, next: NextFunction) {
    if (req.user.id.toString() !== req.project.manager.toString()){   // si el proyecto no coincide con la tarea
        const error = new Error('Acción no válida')
        res.status(400).json({error: error.message})        // retorna un error y no sigue con la ejecución
                                              
        return
    }
    next()
}