# Plataforma de Torneos Deportivos

## Pre-entrega 4 — Autenticación con Passport.js

Esta entrega refactoriza el sistema de autenticación existente para centralizar
los procesos de registro, login y validación de sesión mediante Passport.js,
manteniendo el comportamiento externo de la API.

Se utilizan estrategias independientes para:
- register
- login
- current

## Temática

La plataforma está orientada a la gestión de **torneos deportivos**.

Roles previstos:
- `admin`: administración general.
- `organizer`: creación y administración de torneos.
- `user`: consulta e inscripción a torneos.

La autenticación mediante JWT y cookies está implementada en esta entrega. La autorización por roles, inscripciones y lógica completa de torneos quedan para próximas entregas.

## Tecnologías

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JavaScript
- npm
- dotenv
- bcrypt
- Módulos ESM
- Postman
- Git y GitHub

## Instalación

Requisitos:

- Node.js
- npm
- Una cuenta de MongoDB Atlas

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-torneos-backend
npm install
```

## Variables de entorno

 Crear un archivo `.env` en la raíz del proyecto y completar las variables de entorno.

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/torneos
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1h
```

La variable MONGO_URL debe contener la cadena de conexión de MongoDB Atlas.
JWT_SECRET se utiliza para firmar y verificar los tokens JWT.
JWT_EXPIRES_IN define el tiempo de expiración del JWT.
No subir nunca el archivo .env al repositorio.

## Ejecución
Modo normal:

```bash
npm start
```

o modo desarrollo:

```bash
npm run dev
```

Servidor por defecto:

```text
http://localhost:8080
```

## Estructura

```text
proyecto-torneos-backend/
├── src/
│   ├── app.js                         → configura la aplicación Express y Passport.
│   ├── server.js                      → inicia el servidor y conecta MongoDB.
│   ├── config/
│   │   ├── database.js                → configura la conexión con MongoDB.
│   │   └── passport.config.js         → centraliza las estrategias de Passport.
│   ├── routes/
│   │   ├── events.router.js           → define las rutas de eventos.
│   │   └── sessions.router.js         → define las rutas de autenticación.
│   ├── controllers/
│   │   ├── events.controller.js       → maneja las solicitudes de eventos.
│   │   └── sessions.controller.js     → maneja las respuestas de autenticación.
│   ├── services/
│   │   └── .gitkeep                   → mantiene preparada la carpeta de servicios.
│   ├── repositories/
│   │   └── users.repository.js        → comunica la aplicación con el DAO.
│   ├── dao/
│   │   └── users.dao.js               → realiza operaciones sobre usuarios.
│   ├── models/
│   │   ├── User.js                    → define el modelo de usuario en MongoDB.
│   │   └── Event.js                   → define el modelo de eventos.
│   └── utils/
│       ├── hash.js                    → genera y verifica hashes con bcrypt.
│       └── jwt.js                     → genera y verifica tokens JWT.
├── .env.example                       → muestra las variables de entorno necesarias.
├── .gitignore                         → indica qué archivos no debe subir Git.
├── package.json                       → contiene dependencias y scripts del proyecto.
├── package-lock.json                  → registra las versiones exactas de dependencias.
└── README.md                          → documentación del proyecto.
```

## Arquitectura

La aplicación utiliza una arquitectura por capas y centraliza la autenticación mediante Passport.js.

### Registro

POST /api/sessions/register

                    ↓

           sessions.router.js

                    ↓

        Passport "register"

                    ↓

        sessions.controller.js

                    ↓

          users.repository.js

                    ↓

             users.dao.js

                    ↓

                User.js

                    ↓

             MongoDB Atlas

La estrategia `register` de Passport se encarga de validar los datos,
normalizar el email, verificar duplicados, generar el hash mediante bcrypt
y crear el usuario.

El controller recibe el usuario autenticado mediante `req.user` y genera
la respuesta HTTP sin incluir la contraseña.

### Login

POST /api/sessions/login

                    ↓

           sessions.router.js

                    ↓

          Passport "login"

                    ↓

        users.repository.js

                    ↓

             users.dao.js

                    ↓

                User.js

                    ↓

             MongoDB Atlas

                    ↓

                req.user

                    ↓

        sessions.controller.js

                    ↓

              JWT + cookie

La estrategia `login` valida las credenciales mediante bcrypt.

Luego de una autenticación exitosa, el controller genera el JWT y lo
almacena en la cookie `currentUser`.

### Current

GET /api/sessions/current

                    ↓

           sessions.router.js

                    ↓

         Passport "current"

                    ↓

          cookie currentUser

                    ↓

              JWT válido

                    ↓

                req.user

                    ↓

        sessions.controller.js

La estrategia `current` obtiene el JWT desde la cookie `currentUser`,
verifica su firma utilizando `JWT_SECRET` y coloca el payload en `req.user`.

### Hash de contraseñas

La contraseña nunca se almacena directamente.

Contraseña recibida

        ↓

      bcrypt

        ↓

   Hash seguro

        ↓

     MongoDB

## Registro de usuarios
 
## Registro de usuarios

Endpoint:

POST /api/sessions/register

El registro se realiza mediante la estrategia `register` de Passport.js.

La estrategia valida los datos recibidos, normaliza el email, verifica que
no exista otro usuario con el mismo email, genera el hash de la contraseña
mediante bcrypt y crea el usuario en MongoDB Atlas.

El rol asignado durante el registro público es `user` y no puede ser
modificado mediante el request.

## Body

## Body

```json
{
  "first_name": "Carlos",
  "last_name": "Gomez",
  "email": "carlos.gomez@mail.com",
  "password": "Carlos123"
}
```
Los campos obligatorios son:

- first_name
- last_name
- email
- password

Ejemplo:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "123456"
}
```

El campo role no debe enviarse en el registro público.

El servidor asigna automáticamente: ` "role": "user" `

## Respuesta exitosa:

Código HTTP: `201 Created`

Ejemplo:

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La contraseña nunca se devuelve en la respuesta.

## Validaciones

El endpoint valida:

- Campos obligatorios.
- Formato del email.
- Longitud mínima de 6 caracteres para la contraseña.
- Email duplicado.
- Normalización del email mediante trim() y toLowerCase().
- El rol se asigna automáticamente como `user` y no puede ser manipulado desde el registro público.

## Campos faltantes

Código HTTP: `400 Bad Request`

Respuesta:

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

## Email inválido

Código HTTP: `400 Bad Request`

Respuesta:

```json
{
  "status": "error",
  "message": "Email inválido"
}
```

## Email duplicado

Código HTTP: `409 Conflict`

Respuesta:

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

Pruebas realizadas

Se verificaron mediante Postman los siguientes casos:

- Registro exitoso.
- Asignación automática del rol user.
- Campos obligatorios faltantes.
- Email inválido.
- Email duplicado.
- Contraseña almacenada mediante bcrypt.
- Contraseña excluida de la respuesta.
- Persistencia de usuarios en MongoDB Atlas.



## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo. |
| GET | `/api/events` | Obtiene la lista de eventos. |
| POST | `/api/sessions/register` | Registra un nuevo usuario. |
| POST | `/api/sessions/login` | Inicia sesión y genera la cookie de autenticación. |
| GET | `/api/sessions/current` | Devuelve los datos del usuario autenticado. |
| POST | `/api/sessions/logout` | Cierra la sesión y elimina la cookie de autenticación. |

## Autenticación

### Register

Endpoint:

POST /api/sessions/register

Permite registrar un nuevo usuario.

La estrategia `register` de Passport.js se encarga de validar los datos, normalizar el email, verificar que no exista otro usuario con el mismo email, generar el hash de la contraseña mediante bcrypt y crear el usuario.

El rol se establece como `user` por defecto y no puede ser manipulado desde el registro público.

Respuesta exitosa:

Código HTTP: `201 Created`

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "first_name": "Usuario",
    "last_name": "Prueba",
    "email": "usuario.passport@test.com",
    "role": "user"
  }
}
```

La contraseña nunca se incluye en la respuesta.

### Login

Endpoint:

POST /api/sessions/login

Permite iniciar sesión con un usuario registrado.

Request:

```json
{
  "email": "carlos.gomez@mail.com",
  "password": "Carlos123"
}
```

La estrategia `login` de Passport.js busca el usuario por email y compara la contraseña con el hash almacenado mediante bcrypt.

Si las credenciales son correctas, Passport coloca el usuario autenticado en `req.user`. Luego, el controller genera un JWT firmado con `JWT_SECRET`.

El token se almacena en una cookie llamada `currentUser` con las siguientes características:

- `httpOnly: true`
- `sameSite: "lax"`
- `maxAge: 3600000`
- `secure: true` únicamente en producción

Respuesta exitosa:

Código HTTP: `200 OK`

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Si las credenciales son incorrectas:

Código HTTP: `401 Unauthorized`

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

### Usuario autenticado

Endpoint:

GET /api/sessions/current

Esta ruta está protegida por la estrategia `current` de Passport.js.

La estrategia `current` lee el JWT desde la cookie `currentUser`, verifica su validez y coloca la información del usuario en `req.user`.

Request:

```http
GET /api/sessions/current
```

Respuesta exitosa:

Código HTTP: `200 OK`

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "email": "carlos.gomez@mail.com",
    "role": "user"
  }
}
```

Si no existe una cookie válida o el JWT no es válido:

Código HTTP: `401 Unauthorized`

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### Logout

Endpoint:

POST /api/sessions/logout

Cierra la sesión eliminando la cookie de autenticación `currentUser`.

Request:

```http
POST /api/sessions/logout
```

Respuesta exitosa:

Código HTTP: `200 OK`

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

## Otras rutas

### Health

```http
GET /api/health
```

Respuesta:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

### Events

```http
GET /api/events
```

Respuesta:

```json
{
  "status": "success",
  "payload": []
}
```

## Seguridad

No subir al repositorio:

- `.env`
- `node_modules`
- Contraseñas
- Credenciales de MongoDB Atlas
- Secretos JWT

El archivo `.env` está incluido en `.gitignore.`

## Próximas etapas

- Passport.
- Roles y autorización.
- CRUD de torneos.
- Categorías.
- Inscripciones.
- Control de cupos.
- Notificaciones.

## Importante

No subir `.env`, `node_modules` ni credenciales al repositorio.
