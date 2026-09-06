# Plataforma de Torneos Deportivos

## Pre-entrega 5 — Roles y autorización.

Esta entrega incorpora un sistema de autorización basado en roles,
utilizando middlewares reutilizables para controlar el acceso a las
rutas según los permisos de cada usuario.

La autenticación existente mediante Passport.js, JWT y cookies se mantiene
como base del sistema.

Se utilizan los roles:

- user
- organizer
- admin

## Temática

La plataforma está orientada a la gestión de **torneos deportivos**.

Roles previstos:
- `admin`: administración general.
- `organizer`: creación y administración de torneos.
- `user`: consulta de torneos.

La autenticación mediante JWT y cookies está implementada en esta entrega.

## Tecnologías

- Node.js → entorno de ejecución de JavaScript del lado del servidor.
- Express → framework utilizado para crear la API REST y definir rutas y middlewares.
- MongoDB Atlas → servicio de base de datos MongoDB utilizado para almacenar la información.
- Mongoose → ODM utilizado para conectar Node.js con MongoDB y definir los modelos.
- JavaScript → lenguaje utilizado para desarrollar el backend.
- npm → gestor de paquetes utilizado para instalar y administrar dependencias.
- dotenv → carga las variables de entorno desde el archivo `.env`.
- bcrypt → genera y compara hashes de contraseñas.
- jsonwebtoken → genera y verifica tokens JWT para la autenticación.
- cookie-parser → permite leer y administrar cookies HTTP.
- Passport.js → centraliza y administra las estrategias de autenticación.
- passport-local → estrategia de Passport utilizada para `register` y `login`.
- passport-jwt → dependencia disponible para estrategias JWT de Passport y futuras extensiones de autenticación.
- Módulos ESM → sistema de módulos utilizado para organizar imports y exports.
- Postman → herramienta utilizada para probar los endpoints de la API.
- Git y GitHub → control de versiones y almacenamiento remoto del proyecto.

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
proyecto-torneos-backend/
├── src/
│   ├── app.js                         → configura la aplicación Express y Passport.
│   ├── server.js                      → inicia el servidor y conecta MongoDB.
│   ├── config/
│   │   ├── database.js                → configura la conexión con MongoDB.
│   │   └── passport.config.js         → centraliza las estrategias de Passport.
│   ├── routes/
│   │   ├── admin.router.js            → define las rutas exclusivas de administración.
│   │   ├── events.router.js           → define las rutas de eventos.
│   │   └── sessions.router.js         → define las rutas de autenticación.
│   ├── controllers/
│   │   ├── events.controller.js       → maneja las solicitudes de eventos.
│   │   ├── sessions.controller.js     → maneja las respuestas de autenticación.
│   │   └── users.controller.js        → maneja la consulta de usuarios.
│   ├── services/
│   │   └── .gitkeep                   → mantiene preparada la carpeta de servicios.
│   ├── repositories/
│   │   ├── events.repository.js       → comunica la aplicación con el DAO de eventos.
│   │   └── users.repository.js        → comunica la aplicación con el DAO de usuarios.
│   ├── dao/
│   │   ├── events.dao.js               → realiza operaciones sobre eventos.
│   │   └── users.dao.js                → realiza operaciones sobre usuarios.
│   ├── models/
│   │   ├── User.js                    → define el modelo de usuario en MongoDB.
│   │   └── Event.js                   → define el modelo de eventos.
│   ├── middlewares/
│   │   ├── auth.middleware.js         → valida la sesión mediante JWT.
│   │   └── authorize.middleware.js    → verifica los permisos según el rol.
│   └── utils/
│       ├── hash.js                    → genera y verifica hashes con bcrypt.
│       └── jwt.js                     → genera y verifica tokens JWT.
├── .env.example                       → muestra las variables de entorno necesarias.
├── .gitignore                         → indica qué archivos no debe subir Git.
├── package.json                       → contiene dependencias y scripts del proyecto.
├── package-lock.json                  → registra las versiones exactas de dependencias.
└── README.md                          → documentación del proyecto.

## Arquitectura

La aplicación utiliza una arquitectura por capas:

**Ruta → Middleware → Controller → Repository → DAO → Model**

Cada capa tiene una responsabilidad específica:

- **Routes:** reciben las solicitudes HTTP y determinan qué middlewares y controllers ejecutar.
- **Middlewares:** validan autenticación y autorización antes de llegar al controller.
- **Controllers:** reciben la solicitud, ejecutan la operación correspondiente y construyen la respuesta HTTP.
- **Repositories:** funcionan como una capa intermedia entre los controllers y los DAO.
- **DAO:** realiza las operaciones directamente sobre los modelos de MongoDB.
- **Models:** definen la estructura de los documentos almacenados en MongoDB.

### Flujo de autenticación y autorización

Para acceder a una ruta protegida, el flujo es:

```text
Cliente
   ↓
Route
   ↓
auth.middleware
   ↓
¿JWT válido?
   ├── No → 401 Unauthorized
   │
   └── Sí
        ↓
   authorize(...)
        ↓
   ¿Rol permitido?
        ├── No → 403 Forbidden
        │
        └── Sí
             ↓
          Controller
             ↓
        Repository
             ↓
            DAO
             ↓
          MongoDB

El `auth.middleware.js` valida el JWT almacenado en la cookie `currentUser` y coloca la información del usuario en req.user.

El `authorize.middleware.js` recibe los roles permitidos para cada ruta y verifica que el usuario autenticado tenga uno de ellos.

La generación del JWT continúa siendo responsabilidad del controller de login. Passport se utiliza para las estrategias de registro y login, mientras que la validación de acceso a rutas privadas se realiza mediante los middlewares correspondientes.

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

            auth.middleware.js

                    ↓

          cookie currentUser

                    ↓

             JWT válido

                    ↓

              req.user

                    ↓

        sessions.controller.js

La ruta `current` utiliza `auth.middleware.js` para obtener el JWT desde la
cookie `currentUser`, verificarlo y colocar su payload en `req.user`.

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

Endpoint:

POST /api/sessions/register

El registro se realiza mediante la estrategia `register` de Passport.js.

La estrategia valida los datos recibidos, normaliza el email, verifica que
no exista otro usuario con el mismo email, genera el hash de la contraseña
mediante bcrypt y crea el usuario en MongoDB Atlas.

El rol asignado durante el registro público es `user` y no puede ser
modificado mediante el request.

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

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo | Público |
| GET | `/api/events` | Consulta los eventos | Público |
| POST | `/api/sessions/register` | Registra un nuevo usuario | Público |
| POST | `/api/sessions/login` | Inicia sesión | Público |
| GET | `/api/sessions/current` | Obtiene el usuario autenticado | Autenticado |
| POST | `/api/sessions/logout` | Cierra la sesión | Público |
| POST | `/api/events` | Crea un evento | `organizer`, `admin` |
| PUT | `/api/events/:id` | Modifica un evento | `organizer`, `admin` |
| GET | `/api/admin/users` | Consulta todos los usuarios | `admin` |

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

Esta ruta está protegida por `auth.middleware.js`.

El middleware lee el JWT desde la cookie `currentUser`, verifica su validez y coloca la información del usuario en `req.user`.

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
 ## Roles y autorización

La API utiliza tres roles:

- `user` → usuario registrado. Puede consultar eventos publicados.
- `organizer` → puede consultar eventos, crear eventos y modificar sus propios eventos.
- `admin` → puede consultar eventos, crear eventos, modificar cualquier evento y consultar todos los usuarios.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

### Middlewares

La autorización está separada en middlewares reutilizables:

- `auth.middleware.js` → valida el JWT almacenado en la cookie `currentUser`. Si no existe una sesión válida, responde `401`.
- `authorize.middleware.js` → recibe los roles permitidos y verifica el rol de `req.user`. Si el usuario está autenticado pero no tiene permisos, responde `403`.

### Rutas protegidas

- `GET /api/sessions/current` → requiere autenticación.
- `POST /api/events` → requiere rol `organizer` o `admin`.
- `PUT /api/events/:id` → requiere rol `organizer` o `admin` y valida la propiedad del evento.
- `GET /api/admin/users` → requiere rol `admin`.

### Diferencia entre 401 y 403

- `401 Unauthorized` → el usuario no está autenticado o no posee una sesión válida.
- `403 Forbidden` → el usuario está autenticado, pero su rol no tiene permiso para realizar la acción.

La propiedad de los eventos también se valida en el backend. Un `organizer` solo puede modificar eventos cuyo campo `organizer` coincida con su propio usuario. Un `admin` puede modificar cualquier evento.

## Seguridad

No subir al repositorio:

- `.env`
- `node_modules`
- Contraseñas
- Credenciales de MongoDB Atlas
- Secretos JWT

El archivo `.env` está incluido en `.gitignore`.

## Próximas etapas

- CRUD de torneos.
- Categorías.
- Inscripciones.
- Control de cupos.
- Notificaciones.
- Integración con proveedores de autenticación externos.