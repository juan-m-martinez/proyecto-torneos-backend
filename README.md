# Plataforma de Torneos Deportivos

## Pre-entrega 2 — Registro seguro de usuarios

API REST inicial para una plataforma de torneos deportivos. Esta entrega prepara una arquitectura por capas para futuras funcionalidades.

### Temática

La plataforma está orientada a la gestión de **torneos deportivos**.

Roles previstos:
- `ADMIN`: administración general.
- `ORGANIZER`: creación y administración de torneos.
- `USER`: consulta e inscripción a torneos.

La autenticación, autorización, inscripciones y lógica completa de torneos quedan para próximas entregas.

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
│   ├── middlewares/
│   └── utils/
│       └── hash.js
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

# Respuesta exitosa:

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

# Validaciones

El endpoint valida:

- Campos obligatorios.
- Formato del email.
- Longitud mínima de 6 caracteres para la contraseña.
- Email duplicado.
- Normalización del email mediante trim() y toLowerCase().

# Campos faltantes

Código HTTP: `400 Bad Request`

Respuesta:

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

# Email inválido

Código HTTP: `400 Bad Request`

Respuesta:

```json
{
  "status": "error",
  "message": "Email inválido"
}
```

# Email duplicado

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

### Seguridad

No subir al repositorio:

- .env
- node_modules
- Contraseñas
- Credenciales de MongoDB Atlas
- Secretos JWT

El archivo `.env` está incluido en `.gitignore.`

### Próximas etapas

- Login.
- JWT.
- Cookies.
- Passport.
- Roles y autorización.
- CRUD de torneos.
- Categorías.
- Inscripciones.
- Control de cupos.
- Notificaciones.

## Importante

No subir `.env`, `node_modules` ni credenciales al repositorio.
