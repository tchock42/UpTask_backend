import mongoose, { Document, Schema, PopulatedDoc, Types } from "mongoose";
import Task, { ITask } from "./Task";
import { IUser } from "./Auth";
import Note from "./Note";

// typescript, define el type para el modelo Proyect
export interface IProject extends Document{ // hereda y extiende el type de Document
    projectName: string
    clientName: string
    description: string
    tasks: PopulatedDoc<ITask & Document>[] // cada proyecto tiene un array de tareas y el generico PopulatedDoc<ITask & Document> es para que se pueda acceder a los metodos de mongoose
    manager: PopulatedDoc<IUser & Document> // referencia al usuario 
    team: PopulatedDoc<IUser & Document>[]
}

// mongoose, definición del schema
const ProjectSchema: Schema = new Schema({ // crea un nuevo esquema de mongoose
    projectName: {          // nombre de cada proyecto
        type: String,       // String es de mongoose
        required: true,
        trim: true
    },
    clientName: {           // nombre de cliente
        type: String,
        required: true,
        trim: true
    },
    description: {          // descripcion
        type: String,
        required: true,
        trim: true
    },
    tasks: [    // array de tareas que se relacionan con el proyecto
        {
            type: Types.ObjectId,   // tipo de dato ObjectId de mongoose
            ref: 'Task'                             // referencia a la colección Task
        }
    ],
    manager: {
        type: Types.ObjectId,   // tipo de dato ObjectId de mongoose
        ref: 'User'                             // referencia a la colección User
    },
    team: [    // array de tareas que se relacionan con el proyecto
        {
            type: Types.ObjectId,   // tipo de dato ObjectId de mongoose
            ref: 'User'                             // referencia a la colección Task
        }
    ]
}, {timestamps: true})   // timestamps: true, agrega la fecha de creación y actualización

/** Middleware */
ProjectSchema.pre('deleteOne', { document: true}, async function(){
    const projectId = this._id      // extrae el id del proyecto eliminado
    if(!projectId) return   
        const  tasks = await Task.find({project: projectId})   // busca las tareas que tengan dicho id

        for(const task of tasks){                   // itera en las tareas eliminando sus notas
            await Note.deleteMany({task:task.id})
        }
        
        await Task.deleteMany({project: projectId}) // elimina las tareas del proyecto
})

// Modelo
const Project = mongoose.model<IProject>('Project', ProjectSchema)    // crea el modelo Project con el type ProjectType | mongoose.model(nombre, esquema)

export default Project