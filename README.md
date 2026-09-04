# Plataforma de Torneos Deportivos

## Pre-entrega 1 — Base arquitectónica para Backend II

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
- MongoDB / Mongoose
- JavaScript
- npm
- dotenv
- Módulos ESM
- Postman o Insomnia
- Git y GitHub

## Instalación

Requisitos: Node.js y npm.

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto-torneos
npm install
```

Crear `.env` copiando `.env.example`.

## Variables de entorno

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/torneos
JWT_SECRET=change_this_secret
```

En esta entrega `MONGO_URL` y `JWT_SECRET` quedan preparados para próximas etapas.

## Ejecución

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
proyecto-torneos/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── services/
│   ├── repositories/
│   ├── dao/
│   ├── models/
│   │   ├── User.js
│   │   └── Event.js
│   ├── middlewares/
│   └── utils/
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Rutas

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

### Sessions

```http
GET /api/sessions
```

Endpoint preparado para próximas entregas.

## Próximas etapas

- Registro y login.
- bcrypt.
- JWT.
- Cookies.
- Passport.
- Roles y autorización.
- CRUD de torneos.
- Categorías.
- Registration.
- Control de cupos.
- Notificaciones.

## Importante

No subir `.env`, `node_modules` ni credenciales al repositorio.
