import type {Request, Response} from 'express'
import Note, {INote} from '../models/Note'
import { Types } from 'mongoose'

type NoteParams = {         // type para el noteId del params
    noteId: Types.ObjectId
}

export class NoteController{
    // crear nota
    static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
        
        const {content} = req.body
        // insertando la informacion a la instancia note
        const note = new Note()
        note.content = content      // las demas propiedades de la nota se toman de user y task
        note.createdBy = req.user.id
        note.task = req.task.id
        req.task.notes.push(note.id)
        // guardando en la bd la tarea y la nota
        try {
            await Promise.allSettled([req.task.save(), note.save()])    // se guarda aunque no se use la instancia
            res.send('Nota creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }   
    }
    // obtener las notas de una tarea
    static getTaskNotes = async (req: Request<{}, {}, INote>, res: Response) => {
        
        try {
            const notes = await Note.find({task: req.task.id})      // se busca la tarea mediante el id de la tarea
            res.json(notes)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
    // eliminar notas
    static deleteNote = async (req: Request<NoteParams>, res: Response) => {
        const {noteId} = req.params // extrae del query string
        const note = await Note.findById(noteId)

        if(!note){                                                  // si no se encuentra en la bd
            const error = new Error('Nota no encontrada')
            res.status(404).json({error: error.message})
            return
        }
        if(note.createdBy.toString() !== req.user.id.toString()){   // si no coincide el usuario que creo la nota
            const error = new Error('Acción no válida')
            res.status(401).json({error: error.message})
            return
        }

        req.task.notes = req.task.notes.filter(note => note.toString() !== noteId.toString())   // elimina la nota de la tarea
        
        try {
            await Promise.allSettled([req.task.save(), note.deleteOne()])
            res.send('Nota eliminada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }
}