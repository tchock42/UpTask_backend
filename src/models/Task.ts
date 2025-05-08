import mongoose, { Document, Schema, Types } from "mongoose";
import Note from "./Note";

// objeto con diccionario para estados
const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgress',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const                          // const assertions, no puede ser cambiado

export type TaskStatus = typeof taskStatus[keyof typeof taskStatus] // type para el objeto taskStatus que es un string con los valores de 
                                                                    // taskStatus. Usa la notacion de index para obtener los valores, 
                                                                    // por ejemplo taskStatus['PENDING'] es igual a 'pending'

// type para el modelo Task
export interface ITask extends Document{
    name: string            
    description: string
    project:Types.ObjectId  // cada tarea tiene un proyecto y su tipo es ObjectId
    status: TaskStatus      // cada tarea tiene un estado y su tipo es TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]                     // objeto con los usuarios y el status que definieron
    notes: Types.ObjectId[]
}

// schema para el modelo con mongoose
export const TaskSchema: Schema = new Schema({
    name: {
        type: String,   // string, dado por el usuario
        required: true,
        trim: true
    },
    description: {
        type: String,   // string, dado por el usuario
        required: true,
        trim: true
    },  
    project: {          // en un proyecto ya se tiene su id
        type: Types.ObjectId,
        ref: 'Project'  // el documento Task tiene como referencia el id del proyecto
    },
    status: {           // empieza como pending, el usuario lo puede cambiar
        type: String,
        enum: Object.values(taskStatus), // valores permitidos, que son los values en taskStatus
        default: taskStatus.PENDING     // valor inicial va a ser pendiente
    },
    completedBy: [                                  // arreglo de objetos
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',                        // referenciado a user
                default: null
            },
            status: {                               // lo mismo que en taskSchema
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [                        // arreglo de objetos
        {
            type: Types.ObjectId,
            ref: 'Note'             // referenciado al modelo Note
        }
    ]
}, {timestamps: true})  // timestamps: true, agrega la fecha de creación y actualización

/** Middleware */
TaskSchema.pre('deleteOne', { document: true, query: false}, async function(){
    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({task: taskId})
})

const Task = mongoose.model<ITask>('Task', TaskSchema) // mongoose.model(nombre del modelo, Su schema)

export default Task 