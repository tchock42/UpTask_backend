import {Router} from 'express'
import { body, param } from 'express-validator'
import { ProjectController } from '../controllers/ProjectController'
import { handleInputErrors } from '../middleware'
import { TaskController } from '../controllers/TaskController'
import { validateProjectExist } from '../middleware/project'
import { hasAuthorization, taskBelongsToProject, validateTaskExist } from '../middleware/task'
import { authenticate } from '../middleware/auth'
import { TeamMemberController } from '../controllers/TeamController'
import { NoteController } from '../controllers/NoteController'

// definicion de rutas específicas con los proyectos de la API

const router = Router()     // Crear un objeto de tipo Router

router.use(authenticate)        // agrega la autenticación por JWT para verficar que el usuario inició sesión en cada endopoint en adelante de este archivo

router.get('/', 
    ProjectController.getAllProjects)   // Definir la ruta para obtener todos los proyectos, hace refrencia a  /api/projects 1 metodo encargado del control

router.post('/',                    // envío de datos para crear nuevo proyecto
    body('projectName')             // validación de nombre del proyecto
        .notEmpty().withMessage('El nombre del Proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatorio'),
    handleInputErrors,  // si no hay errores, pasa al controlador
    ProjectController.createProject)    // y envía los datos


router.get('/:id', 
    param('id').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    handleInputErrors,                      // maneja los errores   
    ProjectController.getProjectById)       // si no hay errores, hace la consulta

//ejecuta validacion del projectId para todas las siguientes urls
router.param('projectId', validateProjectExist)     // ademas pasa a request el project

router.put('/:projectId', 
    param('projectId').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    body('projectName')
        .notEmpty().withMessage('El nombre del Proyecto es obligatorio'),
    body('clientName')
        .notEmpty().withMessage('El nombre del cliente es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del proyecto es obligatorio'),
    handleInputErrors,                      // maneja los errores   
    hasAuthorization,
    ProjectController.updateProject)       // si no hay errores, hace la consulta

router.delete('/:projectId', 
    param('projectId').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    handleInputErrors,                      // maneja los errores   
    hasAuthorization,
    ProjectController.deleteProject)       // si no hay errores, hace la consulta


/** rutas para tasks */


// crear nueva tarea a partir de un id de pryecto
router.post('/:projectId/tasks',
    hasAuthorization,
    body('name')             // se validan las entradas
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatorio'),
    handleInputErrors,
    TaskController.createTask
)
    
// traer todas las tareas a partir de un id de proyecto
router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

// ejecuta validacion de task para las siguiente urls y antes
router.param('taskId', validateTaskExist)    // ademas pasa a request el task
router.param('taskId', taskBelongsToProject)    // valida que la tarea pertenezca al projecto

// obtener tarea por su id
router.get('/:projectId/tasks/:taskId', 
    param('taskId').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    handleInputErrors,                      // maneja los errores  
    TaskController.getTaskById
)

// actualización de tarea
router.put('/:projectId/tasks/:taskId',
    hasAuthorization, 
    param('taskId').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    body('name')             // se validan las entradas
        .notEmpty().withMessage('El nombre de la tarea es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción de la tarea es obligatorio'),
    handleInputErrors,                      // maneja los errores  
    TaskController.updateTask
)

// eliminación de tareas
router.delete('/:projectId/tasks/:taskId',             // requiere el id del proyecto y el id de la tarea a eliminar
    hasAuthorization,
    param('taskId').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    handleInputErrors,                      // maneja los errores  
    TaskController.deleteTask
)

// actualizacion del estado de la tarea
router.patch('/:projectId/tasks/:taskId/status',    // ruta con id de proyecto, id de tarea en /status
    param('taskId').isMongoId().withMessage('ID no válido'),    // param se importa de express-validator y obtiene el id de la url
    body('status')
        .notEmpty().withMessage('El estado de la tarea es obligatoria'),
    handleInputErrors,                      // maneja los errores  
    TaskController.updateStatusTask
)

/***** Rutas para equipos */
router.post('/:projectId/team/find',                // ruta para buscar un miembro por email
    body('email')
        .isEmail().toLowerCase().withMessage('Correo electrónico no válido'),
    handleInputErrors,
    TeamMemberController.findMemberByEmail          // carga el metodo de la clase TeamMemberController
)

// agregar un usuario a un proyecto
router.post('/:projectId/team',
    body('id')
        .isMongoId().withMessage('ID de usuario no válido'),
    handleInputErrors,
    TeamMemberController.addMemberById
)

// eliminar un usuario como colaborador
router.delete('/:projectId/team/:userId',
    param('userId')
        .isMongoId().withMessage('ID de usuario no válido'),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

// obtener los miembros del equipo
router.get('/:projectId/team',
    
    TeamMemberController.getProjectTeam
)

/** Routes for Notes */
router.post('/:projectId/tasks/:taskId/notes',      // creat nota
    body('content')
        .notEmpty().withMessage('El contenido de la nota es obligatorio'),
    handleInputErrors,
    NoteController.createNote
)

// traer notas
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getTaskNotes
)

// eliminar notas
router.delete('/:projectId/tasks/:taskId/notes/:noteId',
    param('noteId').isMongoId().withMessage('ID de nota no válida'),
    handleInputErrors,
    NoteController.deleteNote
)
export default router