import {request, type Request, type Response} from 'express'
import Project from '../models/Project'

export class ProjectController {

    static createProject = async (req: Request, res: Response) => { // metodo estatico para obtener todos los proyectos
        
        const proyect = new Project(req.body)
        // Asigna un manager
        proyect.manager = req.user.id;
        
        try {
            await proyect.save()
            // await Project.create(req.body) // forma abreviada de guardar en la base de datos, no requiere instancia
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static getAllProjects = async (req: Request, res: Response) => { // metodo estatico para obtener todos los proyectos
        try {
            const projects = await Project.find({   // find espera con objto
                $or: [                              // $or es un operador de busqueda que busca en un arreglo de objetos
                    {manager: {$in: req.user.id}},   // $in es otro operador que selecciona los documentos que cumplen con el id del usuario actual
                    {team:{$in: req.user.id}}       // si se es parte del equipo de trabajo, trae el proyecto
                ]
            })     // find espera con objto
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async ( req: Request, res: Response ) => {
        const {id} = req.params
        try {
            const project = await Project.findById(id).populate('tasks')            // está generando error la respuesta
            

            if(!project){           // si no se encuentra un projecto
                const error = new Error('Proyecto no encontrado')
                res.status(404).json({error: error.message}) // recupera el mensaje de la constante error y lo carga en el json del status 404
                return                                          // y sale del metodo 
            }
            // validacion si el proyecto no pertenece al usuario
            if(project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id.toString())){  // si el id del proyecto consultado no coincide con el token y si el id del usuario no pertenece al equipo 
                const error = new Error('Proyecto no encontrado')       // se crea un error
                res.status(404).json({error: error.message}) // recupera el mensaje de la constante error y lo carga en el json del status 404
                return 
            }
            // console.log(project)
            res.json(project)

        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Error al obtener el proyecto'})
        }
    }

    static updateProject = async ( req: Request, res: Response ) => {
        // la validacion del proyecto se realiza en un middleware
        try {
            
            // la validacion de que el usuario tenga autorizacion para editar un proyecto se realiza en el middleware hasAuthorization
            req.project.clientName = req.body.clientName
            req.project.projectName = req.body.projectName
            req.project.description = req.body.description
            await req.project.save() // guarda el proyecto actualizado 
            res.send('Proyecto actualizado correctamente')

        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Error al obtener el proyecto'})
        }
    }

    static deleteProject = async (req: Request, res: Response) => { // metodo estatico para obtener todos los proyectos
        // las validaciones se realizan en el middleware
    
        try {
            await req.project.deleteOne()
            res.send('Proyecto eliminado')
        } catch (error) {
            console.log(error)
            res.status(500).json({error: 'Error al obtener el proyecto'})
        }
    }
}