# 📋 UpTask - Backend MERN

Backend de aplicación de gestión de proyectos y tareas construido con **Express.js**, **TypeScript**, **MongoDB** y **Mongoose**.

UpTask es una plataforma colaborativa que permite crear proyectos, gestionar tareas, agregar notas y administrar equipos de trabajo de manera eficiente.

---

## 🚀 Características Principales

- ✅ **Autenticación segura** con JWT (JSON Web Tokens)
- 👥 **Gestión de equipos** - Invita y colabora con otros usuarios
- 📁 **Proyectos** - Crea y organiza tus proyectos
- ✓ **Tareas** - Asigna tareas con diferentes estados
- 📝 **Notas** - Añade notas dentro de tus tareas
- 📧 **Notificaciones por Email** - Recibe correos de confirmación y notificaciones
- 🔒 **CORS habilitado** - Comunicación segura con frontend
- 📊 **Logging con Morgan** - Registro detallado de peticiones HTTP

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|-----------|---------|-------------|
| **Node.js** | - | Runtime de JavaScript |
| **Express.js** | - | Framework web minimalista |
| **TypeScript** | - | Lenguaje tipado para JavaScript |
| **MongoDB** | - | Base de datos NoSQL |
| **Mongoose** | - | ODM para MongoDB |
| **JWT** | - | Autenticación con tokens |
| **Nodemailer** | - | Envío de correos electrónicos |
| **Morgan** | - | Logger de peticiones HTTP |
| **CORS** | - | Control de acceso entre dominios |

---

## 📁 Estructura del Proyecto

```
src/
├── controllers/          # Controladores de lógica de negocio
│   ├── AuthController.ts
│   ├── NoteController.ts
│   ├── ProjectController.ts
│   ├── TaskController.ts
│   └── TeamController.ts
├── models/              # Esquemas de MongoDB
│   ├── Auth.ts
│   ├── Note.ts
│   ├── Project.ts
│   ├── Task.ts
│   └── Token.ts
├── routes/              # Rutas de la API
│   ├── AuthRoutes.ts
│   └── projectRoutes.ts
├── middleware/          # Middlewares personalizados
│   ├── auth.ts         # Autenticación JWT
│   ├── project.ts      # Validación de proyectos
│   └── task.ts         # Validación de tareas
├── config/             # Configuraciones
│   ├── cors.ts         # Configuración CORS
│   ├── db.ts           # Conexión a MongoDB
│   └── nodemailer.ts   # Configuración de email
├── emails/             # Plantillas de email
│   └── AuthEmail.ts
├── utils/              # Utilidades
│   ├── auth.ts
│   ├── jwt.ts          # Funciones JWT
│   └── token.ts
├── server.ts           # Configuración del servidor
└── index.ts            # Punto de entrada
```

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **MongoDB** (local o Atlas)

---

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tchock42/UpTask_backend.git
cd uptask-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DATABASE_URL=mongodb://localhost:27017/uptask
JWT_SECRET=tu_secreto_jwt_super_seguro
PORT=4000
NODE_ENV=development
SMTP_HOST=tu_host_smtp
SMTP_PORT=587
SMTP_USER=tu_email
SMTP_PASS=tu_contraseña
FRONTEND_URL=http://localhost:3000
```

---

## 🚀 Ejecución

### Desarrollo

Ejecuta el servidor en modo de desarrollo con recarga automática:

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### Desarrollo de API

```bash
npm run dev:api
```

### Compilación a Producción

```bash
npm run build
```

Esto generará una carpeta `dist/` con el código compilado a JavaScript.

---

## 🔑 Autenticación

La aplicación utiliza **JWT (JSON Web Tokens)** para autenticación. Los tokens deben incluirse en el header `Authorization`:

```
Authorization: Bearer <tu_token_jwt>
```

---

## 📚 Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/confirm-email` - Confirmar email
- `POST /api/auth/forgot-password` - Recuperar contraseña

### Proyectos
- `GET /api/projects` - Listar proyectos
- `POST /api/projects` - Crear proyecto
- `GET /api/projects/:id` - Obtener detalles del proyecto
- `PUT /api/projects/:id` - Actualizar proyecto
- `DELETE /api/projects/:id` - Eliminar proyecto

### Tareas
- `GET /api/projects/:id/tasks` - Listar tareas del proyecto
- `POST /api/projects/:id/tasks` - Crear tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Notas
- `POST /api/tasks/:id/notes` - Crear nota
- `DELETE /api/notes/:id` - Eliminar nota

### Equipos
- `POST /api/teams/:id/members` - Agregar miembro al equipo
- `GET /api/teams/:id/members` - Listar miembros
- `DELETE /api/teams/:id/members/:memberId` - Remover miembro

---

## 📧 Sistema de Emails

El proyecto utiliza **Nodemailer** para enviar correos electrónicos. Asegúrate de configurar correctamente las variables de entorno SMTP.

Eventos que disparan emails:
- 📝 Registro de nuevos usuarios
- 🔑 Recuperación de contraseña
- 👥 Invitaciones a equipos
- ✓ Notificaciones de tareas

---

## 🔐 Seguridad

- ✅ Validación de JWT en rutas protegidas
- ✅ Hashing de contraseñas
- ✅ CORS configurado
- ✅ Validación de entrada de datos
- ✅ Middleware de autenticación

---

## 📝 Scripts Disponibles

```bash
npm run dev           # Ejecutar en desarrollo
npm run dev:api      # Ejecutar API en desarrollo
npm run build        # Compilar TypeScript
npm start            # Ejecutar en producción
```

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 👨‍💻 Autor

**Desarrollado por:** Jacob Gómez Carrillo

---

**Última actualización:** Diciembre 2025
