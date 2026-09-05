# Plataforma de Torneos Deportivos

## Pre-entrega 3 — Autenticación con JWT y cookies

API REST inicial para una plataforma de torneos deportivos. Esta entrega prepara una arquitectura por capas para futuras funcionalidades.

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
cd proyecto-torneos-pre-entrega-1
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
proyecto-torneos-pre-entrega-1/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   │   └── sessions.service.js
│   ├── repositories/
│   │   └── users.repository.js
│   ├── dao/
│   │   └── users.dao.js
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
|   ├── middlewares/
│   |    └── auth.middleware.js → protege rutas
|   └── utils/
|       ├── hash.js → bcrypt
|       └── jwt.js → generar/verificar JWT
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Arquitectura

El registro de usuarios utiliza una arquitectura por capas:

 POST /api/sessions/register
            ↓
   sessions.router.js
            ↓
  sessions.controller.js
            ↓
   sessions.service.js
            ↓
  users.repository.js
            ↓
     users.dao.js
            ↓
        User.js
            ↓
     MongoDB Atlas

La contraseña es procesada mediante bcrypt antes de ser almacenada
 Contraseña recibida
        ↓
      bcrypt
        ↓
   Hash seguro
        ↓
     MongoDB

## Registro de usuarios
 
 Endpoint
 
 POST /api/sessions/register

## Body

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

La contraseña se compara con el hash almacenado mediante bcrypt.

Si las credenciales son correctas, se genera un JWT firmado con `JWT_SECRET`.

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

Esta ruta está protegida por el middleware de autenticación.

El middleware lee la cookie `currentUser`, verifica el JWT y coloca la información del usuario en `req.user`.

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
