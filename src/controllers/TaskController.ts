import type {Request, Response} from 'express'
import Task from '../models/Task'

export class TaskController{
    // crear tarea
    static createTask = async (req: Request, res: Response) => {
        // la validacion del proyecto se hace en el middleware project.ts
        // crear tarea
        try {
            // instanciar tarea
            const task = new Task(req.body) 
            task.project = req.project.id               // agrega a la instancia de tarea el id del proyecto actual guardado en req
            // guardar tarea en el parámetro req
            req.project.tasks.push(task.id)             // guarda en req el array de tarea el id del projecto
            
            // almacenar en la db
            await Promise.allSettled([task.save(), req.project.save()]) // guarda la tarea en la db y guarda el proyecto con el array de tareas en un array de promesas

            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    // obtener tareas en la coleccion tasks
    static getProjectTasks = async (req: Request, res: Response) => {
        try {
            const tasks = await Task.find({project: req.project.id}).populate('project')    //busca tareas donde el campo project tenga el valor de req.project.id | find espera un objeto
                                                                                            // y se trae el proyecto relacionado con un populate
            res.json(tasks)
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) // mostrar un error y no detener la ejecución del código
        }
    }

    //obtener una tarea mediante un id dentro de un proyecto
    static getTaskById = async (req: Request, res: Response ) => {
        try {
            // el task se guarda en el middleware task.ts
            const task = await Task.findById(req.task.id)
                .populate({path: 'completedBy.user', select: '_id name email'})      // manda información del usuario que completó la tarea desde la aPI () sin password
                .populate({path: 'notes', populate: {path: 'createdBy', select: 'id name email'}})
            console.log(task)
            res.status(200).json(task)          // retorna el task
            
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) // error de servidor
        }
    }

    // funcion para actualizar tarea
    static updateTask = async (req: Request, res: Response) => {
        try {

            req.task.name = req.body.name
            req.task.description = req.body.description

            await req.task.save() 
            res.send('Tarea actualizada correctamente')
            return
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) // error de servidor
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {

            // filtra tasks para quitar el taskId
            req.project.tasks = req.project.tasks.filter(task => task.toString() !== req.task.id.toString()) // cada task en un objectId. Si el task actual es diferente al task del params

            // guardar en la base de datos
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.json('Tarea eliminada correctamente')     // retorna respuesta satisfactoria
            return
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) // error de servidor
        }
    }

    static updateStatusTask = async (req: Request, res: Response) => {

        try {
            const {status} = req.body       // lee la información del body

            req.task.status = status        // actualiza la instancia con el nuevo status

            const data = {                  // guarda el user.id y el status actual
                user: req.user.id,
                status
            }
            req.task.completedBy.push(data) // guarda todos los cambios en completedBy
            
            await req.task.save()
            res.json('Estado de la tarea actualizado correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'}) // error de servidor
        }
    }

}