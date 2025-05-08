import { Request, Response } from "express"     // types de express
import User from "../models/Auth"
import Project from "../models/Project"

export class TeamMemberController{

    static findMemberByEmail = async (req: Request, res: Response) => {

        const {email} = req.body

        const user = await User.findOne({email}).select('id email name')        // selecciona solo el id, correo y nombre del usuario
        if(!user){
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        res.json(user)              // retorna al usuario
    }
    static addMemberById = async (req: Request, res: Response) => {

        const {id} = req.body
       
        // buscar al usuario
        const user = await User.findById(id).select('id')
        
        // validaciones
        if(!user){
            const error = new Error('Usuario no encontrado')
            res.status(404).json({error: error.message})
            return
        }
        if(req.project.manager.toString() === user.id.toString()){
            const error = new Error('El manager no puede ser colaborador')
            res.status(409).json({error: error.message})
            return
        }
        if(req.project.team.some(team => team.toString() === user.id.toString())){
            const error = new Error('El usuario ya pertenece al equipo')
            res.status(409).json({error: error.message})
            return
        }

        req.project.team.push(user.id)          // agrega el id del usuario encontrado al proyecto
        await req.project.save()                // guarda en proyecto

        res.send('Usuario agregado al equipo correctamente')
    }
    static removeMemberById = async (req: Request, res: Response) => {

        const {userId} = req.params     // obtiene el id del usuario en la url

        // revisar si existe el usuario en el proyecto
        if(!req.project.team.some(teamMember => teamMember.toString() === userId)){     // si no existe el usuario en el proyecto
            const error = new Error('El usuario no existe en el proyecto')
            res.status(409).json({error: error.message})
            return
        }
        // filtra al usuario seleccionado del array de req.project.team
        req.project.team = req.project.team.filter(teamMember => teamMember.toString() !== userId)
        
        await req.project.save()                // guarda en proyecto

        res.send('Usuario eliminado del equipo correctamente')
    }

    // obtener los miembros del equipo
    static getProjectTeam = async (req: Request, res: Response) => {

        const project = await Project.findById(req.project.id).populate({
            path: 'team',
            select: 'id email name'
        })
        res.json(project.team)
    }
}