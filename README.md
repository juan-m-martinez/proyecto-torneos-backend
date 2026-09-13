# Plataforma de Torneos Deportivos

## Pre-entrega 8 — Arquitectura con DAO, Repository y DTO

En esta entrega se refactorizó la arquitectura del proyecto incorporando de
forma explícita las capas DAO, Repository y DTO, manteniendo la separación
de responsabilidades y sin modificar el comportamiento externo de la API.

La lógica de negocio se sigue concentrando en la capa de Services, que ahora
trabaja exclusivamente contra los Repositories (y nunca contra los modelos
de Mongoose de forma directa). La capa DTO se incorpora para controlar
explícitamente qué información se expone hacia el cliente, evitando
devolver datos sensibles como la contraseña del usuario, incluso cuando
esta se encuentra almacenada como hash.

Las entidades `Event`, `Team` y `Ticket`, junto con la autenticación
mediante Passport.js, JWT y cookies, el sistema de roles y autorización, y
el envío de notificaciones por email mediante Nodemailer implementados en
las entregas anteriores, se mantienen como base del sistema.

## Temática

La plataforma está orientada a la gestión de **torneos y eventos deportivos**,
incluyendo la conformación de equipos y la emisión de tickets para los
jugadores inscriptos.

Roles:

- `admin`: administración general.
- `organizer`: creación y administración de sus propios eventos y equipos.
- `user`: consulta de eventos, inscripción en equipos y gestión de sus propios tickets.

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
- Nodemailer → utilizado para el envío de correos electrónicos desde el backend.
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

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_password_smtp
SMTP_FROM=no-reply@tudominio.com
```

La variable `MONGO_URL` debe contener la cadena de conexión de MongoDB Atlas.
`JWT_SECRET` se utiliza para firmar y verificar los tokens JWT.
`JWT_EXPIRES_IN` define el tiempo de expiración del JWT.
Las variables `SMTP_*` configuran el servidor de correo utilizado por Nodemailer para el envío de notificaciones (`src/utils/mailer.js`).
No subir nunca el archivo `.env` al repositorio.

## Ejecución

**Modo normal:**

```bash
npm start
```

**Modo desarrollo**

```bash
npm run dev
```

**Servidor por defecto:**

```text
http://localhost:8080
```

**Seed de usuarios de prueba:**

```bash
npm run seed:users
```

## Estructura

```text
proyecto-torneos-backend/
├── src/
│   ├── app.js                         → configura Express y Passport.
│   ├── server.js                      → inicia el servidor y conecta MongoDB.
│   ├── config/
│   │   ├── database.js                → configura la conexión con MongoDB.
│   │   └── passport.config.js         → centraliza las estrategias de Passport.
│   ├── routes/
│   │   ├── admin.router.js            → define las rutas exclusivas de administración.
│   │   ├── events.router.js           → define las rutas de eventos.
│   │   ├── teams.router.js            → define las rutas de equipos anidadas bajo eventos.
│   │   ├── tickets.router.js          → define las rutas de tickets.
│   │   └── sessions.router.js         → define las rutas de autenticación.
│   ├── controllers/
│   │   ├── events.controller.js       → maneja las solicitudes y respuestas de eventos.
│   │   ├── teams.controller.js        → maneja las solicitudes y respuestas de equipos.
│   │   ├── tickets.controller.js      → maneja las solicitudes y respuestas de tickets.
│   │   ├── sessions.controller.js     → maneja las respuestas de autenticación.
│   │   └── users.controller.js        → maneja la consulta de usuarios.
│   ├── services/
│   │   ├── events.service.js          → contiene la lógica de negocio de eventos.
│   │   ├── teams.service.js           → contiene la lógica de negocio de equipos.
│   │   ├── tickets.service.js         → contiene la lógica de negocio de inscripciones y tickets.
│   │   └── users.service.js           → contiene la lógica de negocio de usuarios.
│   ├── repositories/
│   │   ├── events.repository.js       → comunica la aplicación con el DAO de eventos.
│   │   ├── teams.repository.js        → comunica la aplicación con el DAO de equipos.
│   │   ├── tickets.repository.js      → comunica la aplicación con el DAO de tickets.
│   │   └── users.repository.js        → comunica la aplicación con el DAO de usuarios.
│   ├── dao/
│   │   ├── events.dao.js              → realiza operaciones sobre eventos.
│   │   ├── teams.dao.js               → realiza operaciones sobre equipos.
│   │   ├── tickets.dao.js             → realiza operaciones sobre tickets.
│   │   └── users.dao.js               → realiza operaciones sobre usuarios.
│   ├── dto/
│   │   ├── event.dto.js               → controla los datos de Event expuestos al cliente.
│   │   ├── team.dto.js                → controla los datos de Team expuestos al cliente.
│   │   ├── ticket.dto.js              → controla los datos de Ticket expuestos al cliente.
│   │   └── user.dto.js                → controla los datos de User expuestos al cliente (excluye la contraseña).
│   ├── models/
│   │   ├── User.js                    → define el modelo de usuario en MongoDB.
│   │   ├── Event.js                   → define el modelo de eventos.
│   │   ├── Team.js                    → define el modelo de equipos.
│   │   └── Ticket.js                  → define el modelo de tickets.
│   ├── middlewares/
│   │   ├── auth.middleware.js         → valida la sesión mediante JWT.
│   │   └── authorize.middleware.js    → verifica los permisos según el rol.
│   ├── seed/
│   │   └── users.seed.js              → crea usuarios de prueba con los distintos roles.
│   └── utils/
│       ├── hash.js                    → genera y verifica hashes con bcrypt.
│       ├── jwt.js                     → genera y verifica tokens JWT.
│       ├── mailer.js                  → configura el envío de correos mediante Nodemailer.
│       └── reservationCode.js         → genera el código de reserva único de cada ticket.
├── .env.example                       → muestra las variables de entorno necesarias.
├── .gitignore                         → indica qué archivos no debe subir Git.
├── package.json                       → contiene dependencias y scripts del proyecto.
├── package-lock.json                  → registra las versiones exactas de dependencias.
└── README.md                          → documentación del proyecto.
```

## Arquitectura

La aplicación utiliza una arquitectura por capas:

**Route → Middleware → Controller → Service → Repository → DAO → Model → MongoDB Atlas**

La respuesta que finalmente recibe el cliente pasa, además, por un DTO que filtra la información sensible antes de salir del Controller.

Cada capa tiene una responsabilidad específica:

- **Routes:** reciben las solicitudes HTTP y determinan qué middlewares y controllers ejecutar.
- **Middlewares:** validan autenticación y autorización antes de llegar al controller.
- **Controllers:** reciben la solicitud, ejecutan la operación correspondiente y construyen la respuesta HTTP. No contienen lógica de negocio ni acceden directamente a MongoDB.
- **Services:** contienen la lógica de negocio y las validaciones propias de la aplicación. Trabajan siempre contra los Repositories, nunca contra los modelos de Mongoose de forma directa.
- **Repositories:** funcionan como una capa intermedia entre los Services y el DAO.
- **DAO:** es la única capa que accede directamente a los modelos de Mongoose, realizando las operaciones sobre MongoDB.
- **Models:** definen la estructura de los documentos almacenados en MongoDB.
- **DTO:** controlan qué información se expone hacia el cliente, evitando devolver datos sensibles o innecesarios.

La lógica de negocio de los eventos se encuentra en `events.service.js`. De esta
forma, las rutas y los controllers no contienen las reglas principales de negocio.

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
          Service
             ↓
         Repository
             ↓
            DAO
             ↓
          MongoDB
```

El `auth.middleware.js` valida el JWT almacenado en la cookie `currentUser` y coloca la información del usuario en `req.user`.

El `authorize.middleware.js` recibe los roles permitidos para cada ruta y verifica que el usuario autenticado tenga uno de ellos.

Passport.js se utiliza para las estrategias de registro y login.

El JWT continúa siendo generado durante el login y almacenado en la cookie `currentUser`.

### DTO y seguridad de datos

Los DTO (Data Transfer Objects) controlan qué información se expone hacia el cliente, evitando devolver información sensible o innecesaria.

Por ejemplo, `user.dto.js` transforma el documento de `User` y devuelve únicamente:

- `id`
- `first_name`
- `last_name`
- `email`
- `role`

El campo `password` nunca se incluye en la respuesta, ni siquiera cuando se encuentra almacenado como hash. Esto mismo se aplica cuando un documento relacionado (por ejemplo, un `Ticket` con su `user` obtenido mediante `populate`) es transformado antes de enviarse al cliente.

Cada entidad principal (`Event`, `Team`, `Ticket`, `User`) posee su propio DTO dentro de `src/dto/`.

## Autenticación

### Registro

Endpoint:

```http
POST /api/sessions/register
```

La estrategia `register` de Passport.js se encarga de:

- validar los datos;
- normalizar el email;
- verificar usuarios duplicados;
- generar el hash de la contraseña mediante bcrypt;
- crear el usuario en MongoDB Atlas.

El rol asignado durante el registro público es siempre `user` y no puede ser manipulado enviándolo en el request.

Body:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "ana@mail.com",
  "password": "123456"
}
```

Campos obligatorios:

- `first_name`
- `last_name`
- `email`
- `password`

Respuesta exitosa:

Código HTTP: `201 Created`

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

**Validaciones:**

El registro valida:

- campos obligatorios;
- formato del email;
- contraseña con mínimo de 6 caracteres;
- email duplicado;
- normalización mediante `trim()` y `toLowerCase()`;
- asignación automática del rol `user`.

Campos obligatorios faltantes:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

Email inválido:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "Email inválido"
}
```

Email duplicado:

Código HTTP: `409 Conflict`

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

### Login

Endpoint:

```http
POST /api/sessions/login
```

Request:

```json
{
  "email": "carlos.gomez@mail.com",
  "password": "Carlos123"
}
```

La estrategia `login` de Passport.js busca el usuario por email y compara la contraseña con el hash almacenado mediante bcrypt.

Si las credenciales son correctas, Passport coloca el usuario autenticado en `req.user`. Luego, el controller genera un JWT firmado con `JWT_SECRET` y lo almacena en una cookie llamada `currentUser`.

Características de la cookie:

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

Credenciales inválidas:

Código HTTP: `401 Unauthorized`

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

### Usuario autenticado (Current)

Endpoint:

```http
GET /api/sessions/current
```

Esta ruta está protegida por `auth.middleware.js`, que obtiene el JWT desde la cookie `currentUser`, verifica su validez y coloca su payload en `req.user`.

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

```http
POST /api/sessions/logout
```

Cierra la sesión eliminando la cookie de autenticación `currentUser`.

Respuesta exitosa:

Código HTTP: `200 OK`

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

### Hash de contraseñas

La contraseña nunca se almacena directamente.

```text
Contraseña recibida
        ↓
      bcrypt
        ↓
   Hash seguro
        ↓
     MongoDB
```

La generación y comparación de hashes se encuentra en `src/utils/hash.js`.

## Entidad Event

La entidad `Event` representa un evento deportivo administrado por un `organizer` o un `admin`.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `title` | String | Título del evento |
| `description` | String | Descripción del evento |
| `category` | String | Categoría del evento |
| `date` | Date | Fecha del evento |
| `location` | String | Lugar donde se realiza |
| `teamsCapacity` | Number | Cantidad máxima de equipos admitidos |
| `playersPerTeam` | Number | Cantidad máxima de jugadores por equipo |
| `price` | Number | Precio de inscripción |
| `status` | String | Estado actual del evento |
| `organizer` | ObjectId | Usuario organizador |

### Estados disponibles

El campo `status` utiliza los siguientes valores:

- `draft`
- `published`
- `cancelled`
- `finished`

El estado inicial de un nuevo evento es `draft`.

### Relación con User

El campo `organizer` almacena una referencia mediante `ObjectId` al modelo `User`. No se almacena el usuario completo embebido dentro del evento.

```text
Event
  │
  └── organizer → User._id
```

Al crear un evento, el `organizer` se obtiene automáticamente desde `req.user.id`. El cliente no puede establecer libremente el `organizer` mediante el body.

## Eventos

### Crear evento

Endpoint:

```http
POST /api/events
```

Acceso: `organizer`, `admin`

Body:

```json
{
  "title": "Torneo de Fútbol",
  "description": "Torneo deportivo de fútbol",
  "category": "futbol",
  "date": "2027-08-20",
  "location": "Club Central",
  "teamsCapacity": 2,
  "playersPerTeam": 3,
  "price": 100
}
```

El `organizer` no se recibe desde el body: el servidor lo asigna automáticamente utilizando el usuario autenticado.

Respuesta exitosa:

Código HTTP: `201 Created`

```json
{
  "status": "success",
  "payload": {
    "id": "...",
    "title": "Torneo de Fútbol",
    "organizer": "..."
  }
}
```

#### Reglas de negocio para crear eventos

Las validaciones se encuentran en `events.service.js`.

**Fecha futura**

La fecha del evento debe ser posterior a la fecha y hora actuales. Si se intenta crear un evento con fecha pasada:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "La fecha del evento debe ser futura"
}
```

**Capacidad**

`teamsCapacity` y `playersPerTeam` deben ser mayores a 0. Cada campo tiene su propio mensaje de error.

Si se envía `{ "teamsCapacity": 0 }`:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "La cantidad de equipos debe ser mayor a 0"
}
```

Si se envía `{ "playersPerTeam": 0 }`:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "La cantidad de jugadores por equipo debe ser mayor a 0"
}
```

`teamsCapacity` define la cantidad máxima de equipos que pueden crearse en el evento, y `playersPerTeam` define la cantidad máxima de jugadores que puede tener cada equipo. Ambos valores se detallan más adelante en la sección [Capacidad de los eventos](#capacidad-de-los-eventos).

**Precio**

El precio no puede ser negativo. Ejemplo inválido: `{ "price": -100 }`:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "El precio no puede ser negativo"
}
```

### Consultar eventos

**Listar eventos**

Endpoint:

```http
GET /api/events
```

La consulta es pública. La respuesta incluye información de paginación:

```json
{
  "status": "success",
  "data": [],
  "page": 1,
  "limit": 10,
  "total": 0,
  "totalPages": 0
}
```

**Consultar un evento por ID**

Endpoint:

```http
GET /api/events/:id
```

La consulta es pública.

Si el evento existe: `200 OK`.

Si no existe:

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

**Filtros de eventos**

El endpoint `GET /api/events` permite aplicar filtros mediante query parameters.

Filtros disponibles:

- `status`
- `category`
- `location`
- `dateFrom`
- `dateTo`

Ejemplos:

```http
GET /api/events?status=published
GET /api/events?category=workshop
GET /api/events?location=Club%20Central
GET /api/events?dateFrom=2027-01-01&dateTo=2027-12-31
```

Los filtros pueden combinarse:

```http
GET /api/events?status=published&category=workshop
```

**Paginación**

El listado permite utilizar `page` y `limit`:

```http
GET /api/events?page=1&limit=2
```

La respuesta incluye `data`, `page`, `limit`, `total` y `totalPages`:

```json
{
  "status": "success",
  "data": [],
  "page": 1,
  "limit": 2,
  "total": 3,
  "totalPages": 2
}
```

**Ordenamiento**

El listado permite indicar el campo de ordenamiento mediante `sort`. Por defecto se utiliza `date`.

```http
GET /api/events?sort=date
```

**Ejemplo completo de consulta**

La siguiente consulta combina estado, categoría, paginación y ordenamiento:

```http
GET /api/events?status=published&category=workshop&page=2&limit=5&sort=date
```

### Modificar eventos

Endpoint:

```http
PUT /api/events/:id
```

Acceso: `organizer`, `admin`

**Organizer:** un `organizer` puede modificar únicamente eventos cuyo campo `organizer` corresponda a su propio usuario. Si intenta modificar un evento de otro organizer:

Código HTTP: `403 Forbidden`

```json
{
  "status": "error",
  "message": "No tenés permisos para modificar este evento"
}
```

**Admin:** un `admin` puede modificar eventos pertenecientes a cualquier organizer.

**Evento inexistente:**

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

**Evento cancelado:** un evento cancelado no puede ser modificado.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "No se puede modificar un evento cancelado"
}
```

### Actualizar estado

Endpoint:

```http
PATCH /api/events/:id/status
```

Acceso: `organizer`, `admin` (y propietario, en el caso del organizer)

Body:

```json
{
  "status": "published"
}
```

Estados permitidos: `draft`, `published`, `cancelled`, `finished`.

**Estado inválido:** si se envía un estado que no pertenece a los valores permitidos:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "Estado de evento inválido"
}
```

**Publicar evento finalizado:** no se puede publicar un evento cuyo estado actual sea `finished`.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "No se puede publicar un evento finalizado"
}
```

**Modificar evento cancelado:** un evento `cancelled` no puede cambiar nuevamente de estado.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "No se puede modificar el estado de un evento cancelado"
}
```

### Cancelación de eventos

La cancelación se realiza modificando el estado del evento:

```json
{
  "status": "cancelled"
}
```

No se realiza eliminación física del documento. El evento permanece almacenado en MongoDB con `status = cancelled`, lo que permite conservar la información histórica del evento.

## Entidad Team

La entidad `Team` representa un equipo inscripto en un evento.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | String | Nombre del equipo |
| `event` | ObjectId | Evento al que pertenece el equipo |
| `captain` | ObjectId | Usuario que oficia de capitán |
| `teamPassword` | String | Contraseña del equipo (hasheada con bcrypt) |

Los nombres de equipo son únicos dentro de cada evento, aunque pueden repetirse entre eventos distintos.

## Equipos

### Crear equipo

Endpoint:

```http
POST /api/events/:eid/teams
```

Acceso: `organizer` (dueño del evento), `admin`

Body:

```json
{
  "name": "Real Vacilada",
  "teamPassword": "123456",
  "captainId": "ID_DEL_USUARIO"
}
```

El `organizer` (dueño del evento) o el `admin` crean el equipo y definen quién será el capitán mediante `captainId`. Al crear el equipo, el capitán recibe automáticamente su ticket de inscripción.

La `teamPassword` se almacena utilizando bcrypt, de la misma forma que las contraseñas de usuario.

#### Reglas de negocio para crear equipos

Las validaciones se encuentran en `teams.service.js`, y se ejecutan en este orden:

**Evento inexistente**

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

**Organizer que no es dueño del evento:** solo el `organizer` propietario del evento (o un `admin`) puede crear equipos en él.

Código HTTP: `403 Forbidden`

```json
{
  "status": "error",
  "message": "No tenés permisos para crear un equipo en este evento"
}
```

**Capitán inexistente**

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Capitán no encontrado"
}
```

**Cupo de equipos alcanzado:** no se puede crear un equipo si el evento ya alcanzó su `teamsCapacity` (cantidad máxima de equipos).

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "No hay cupos para crear otro equipo en este evento"
}
```

**Capitán ya inscripto:** el usuario elegido como capitán no puede tener ya una inscripción activa en el mismo evento (en otro equipo).

Código HTTP: `409 Conflict`

```json
{
  "status": "error",
  "message": "El capitán ya está inscripto en este evento"
}
```

**Nombre de equipo duplicado:** el nombre debe ser único dentro del evento.

Código HTTP: `409 Conflict`

```json
{
  "status": "error",
  "message": "Ya existe un equipo con ese nombre en este evento"
}
```

**Contraseña de equipo demasiado corta:** `teamPassword` debe tener al menos 6 caracteres.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "La contraseña del equipo debe tener al menos 6 caracteres"
}
```

### Consultar equipo

Endpoint:

```http
GET /api/events/:eid/teams/:tid
```

Acceso: cualquier usuario autenticado (no es un endpoint público; requiere el middleware `auth`, pero no exige un rol en particular).

Permite consultar los datos del equipo, incluyendo quién es actualmente el capitán.

Si el equipo no existe:

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Equipo no encontrado"
}
```

## Entidad Ticket

La entidad `Ticket` representa la inscripción de un usuario en un equipo dentro de un evento. Cada usuario ocupa exactamente un cupo: el campo `quantity` se establece automáticamente en `1` y el usuario no puede elegir una cantidad arbitraria.

### Campos

| Campo | Tipo | Descripción |
|---|---|---|
| `user` | ObjectId | Usuario inscripto |
| `event` | ObjectId | Evento al que pertenece la inscripción |
| `team` | ObjectId | Equipo en el que se inscribió el usuario |
| `status` | String | Estado del ticket |
| `quantity` | Number | Cantidad de cupos ocupados (siempre `1`) |
| `reservationCode` | String | Código de reserva generado automáticamente |
| `createdAt` | Date | Fecha de creación del ticket |
| `cancelledAt` | Date | Fecha de cancelación del ticket (si corresponde) |

### Estados disponibles

El campo `status` utiliza los siguientes valores:

- `confirmed`
- `pending`
- `cancelled`

## Tickets

### Inscribirse en un equipo

Endpoint:

```http
POST /api/events/:eid/tickets
```

Acceso: cualquier usuario autenticado.

Body:

```json
{
  "teamId": "ID_DEL_EQUIPO",
  "teamPassword": "123456"
}
```

Para poder inscribirse:

- el evento debe existir;
- el evento debe estar `published`;
- el equipo debe existir y pertenecer al evento indicado;
- la `teamPassword` enviada debe ser correcta;
- el equipo no debe haber alcanzado `playersPerTeam`;
- el usuario no debe estar previamente inscripto en el evento.

Las validaciones se encuentran en `tickets.service.js` y se ejecutan en este orden:

#### Reglas de negocio para inscribirse

**Evento inexistente**

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

**Evento no publicado:** solo se puede uno inscribir en eventos con estado `published`.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "El evento no está disponible para inscripciones"
}
```

**Equipo inexistente**

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Equipo no encontrado"
}
```

**Equipo de otro evento:** el `teamId` enviado debe pertenecer al evento indicado en la URL (`:eid`).

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "El equipo no pertenece a este evento"
}
```

**Contraseña de equipo incorrecta**

Código HTTP: `401 Unauthorized`

```json
{
  "status": "error",
  "message": "Contraseña de equipo incorrecta"
}
```

**Equipo sin cupos:** el equipo ya alcanzó la cantidad máxima de jugadores definida por `playersPerTeam`.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "El equipo ya alcanzó la cantidad máxima de jugadores"
}
```

**Usuario ya inscripto:** un usuario no puede tener más de una inscripción activa en el mismo evento.

Código HTTP: `409 Conflict`

```json
{
  "status": "error",
  "message": "Ya estás inscripto en este evento"
}
```

Cada inscripción exitosa genera un código de reserva, por ejemplo:

```text
TKT-BB63XS
```

### Consultar mis tickets

Endpoint:

```http
GET /api/tickets
```

Acceso: cualquier usuario autenticado.

Devuelve los tickets pertenecientes al usuario autenticado.

### Consultar tickets de un evento

Endpoint:

```http
GET /api/events/:eid/tickets
```

Acceso: `organizer` (propietario del evento), `admin`

Incluye también los tickets cancelados, para conservar el historial de inscripciones.

Si el evento no existe:

Código HTTP: `404 Not Found`

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

Si el usuario autenticado no es ni el organizador dueño del evento ni un `admin`:

Código HTTP: `403 Forbidden`

```json
{
  "status": "error",
  "message": "No tenés permisos para ver los tickets de este evento"
}
```

### Cancelar ticket

Endpoint:

```http
PATCH /api/tickets/:tid/cancel
```

Puede cancelar el ticket: el propietario del ticket o un `admin`.

Al cancelar:

- `status` → `cancelled`
- `cancelledAt` → fecha de cancelación

No se elimina físicamente el ticket.

**Ticket ya cancelado:** si el ticket ya se encuentra cancelado, no se permite volver a cancelarlo.

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "El ticket ya está cancelado"
}
```

## Notificaciones por email

El proyecto utiliza Nodemailer para enviar notificaciones por email en formato de texto plano (sin plantillas HTML). La configuración del servidor SMTP se define mediante las variables de entorno `SMTP_*` (ver [Variables de entorno](#variables-de-entorno)).

Actualmente se envían notificaciones en dos casos:

- **Inscripción confirmada:** el usuario recibe un email con el evento, el equipo y su código de reserva.
- **Inscripción cancelada:** el usuario recibe un email informando la cancelación junto con su código de reserva.

La implementación se encuentra en `src/utils/mailer.js`.

> **Nota:** el envío de email se ejecuta si las variables `SMTP_USER` y `SMTP_PASS` están definidas en el `.env`. Si no se configuran, la inscripción o la cancelación se procesan igualmente, pero no se envía ningún correo.

## Capitanía de equipos

Cuando el capitán cancela su propio ticket:

1. Se busca otro jugador activo del mismo equipo.
2. Si existe otro jugador activo, este pasa a ser automáticamente el nuevo capitán.
3. Si no existen jugadores activos, el equipo queda sin capitán, pero **no se elimina**.

```text
Capitán original
      ↓
Cancela su ticket
      ↓
Ticket = cancelled
      ↓
Se busca jugador activo
      ↓
Jugador 3
      ↓
Jugador 3 pasa a ser capitán
```

Esto permite conservar el historial del equipo aun cuando cambie su capitán.

## Capacidad de los eventos

La capacidad de un evento se maneja mediante dos campos:

- `teamsCapacity`
- `playersPerTeam`

Por ejemplo:

```text
teamsCapacity = 2
playersPerTeam = 3
```

Significa:

- Máximo de equipos: 2
- Máximo de jugadores por equipo: 3
- Máximo total de jugadores: 2 × 3 = 6

La creación de equipos controla `teamsCapacity`, mientras que la inscripción de jugadores (generación de tickets) controla `playersPerTeam`.

## Roles y autorización

La API utiliza tres roles:

- `user` → usuario registrado. Puede consultar eventos, inscribirse en equipos y gestionar sus propios tickets.
- `organizer` → puede consultar eventos, crear eventos, modificar sus propios eventos, actualizar su estado y crear equipos dentro de sus propios eventos.
- `admin` → puede consultar eventos, crear eventos, modificar cualquier evento, actualizar el estado de cualquier evento, crear equipos en cualquier evento y consultar todos los usuarios.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Actualizar estado de eventos propios | ❌ | ✅ | ✅ |
| Actualizar estado de cualquier evento | ❌ | ❌ | ✅ |
| Crear equipos de sus eventos | ❌ | ✅ | ✅ |
| Inscribirse en equipos | ✅ | ✅ | ✅ |
| Cancelar ticket propio | ✅ | ✅ | ✅ |
| Consultar tickets de un evento propio | ❌ | ✅ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

La consulta de eventos puede utilizar el filtro `GET /api/events?status=published` para consultar específicamente eventos publicados.

### Middlewares

La autorización está separada en middlewares reutilizables:

- `auth.middleware.js` → valida el JWT almacenado en la cookie `currentUser`. Si no existe una sesión válida, responde `401`.
- `authorize.middleware.js` → recibe los roles permitidos (por ejemplo `authorize("organizer", "admin")`) y verifica el rol de `req.user`. Si el usuario está autenticado pero no tiene permisos, responde `403`.

### Diferencia entre 401 y 403

- `401 Unauthorized` → el usuario no está autenticado o no posee una sesión válida.

  ```json
  {
    "status": "error",
    "message": "No autenticado"
  }
  ```

- `403 Forbidden` → el usuario está autenticado, pero su rol (o la propiedad del recurso) no le permite realizar la acción.

  ```json
  {
    "status": "error",
    "message": "No tenés permisos para modificar este evento"
  }
  ```

La propiedad de los eventos también se valida en el backend. Un `organizer` solo puede modificar eventos cuyo campo `organizer` coincida con su propio usuario. Un `admin` puede modificar cualquier evento.

## Endpoints

| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/api/health` | Verifica que el servidor esté activo | Público |
| GET | `/api/events` | Lista eventos con filtros y paginación | Público |
| GET | `/api/events/:id` | Consulta un evento por ID | Público |
| POST | `/api/events` | Crea un evento | `organizer`, `admin` |
| PUT | `/api/events/:id` | Modifica un evento | `organizer`, `admin` + propietario |
| PATCH | `/api/events/:id/status` | Actualiza el estado de un evento | `organizer`, `admin` + propietario |
| POST | `/api/events/:eid/teams` | Crea un equipo dentro de un evento | `organizer` (propietario), `admin` |
| GET | `/api/events/:eid/teams/:tid` | Consulta un equipo de un evento | Autenticado |
| POST | `/api/events/:eid/tickets` | Inscribe al usuario autenticado en un equipo | Autenticado |
| GET | `/api/tickets` | Consulta los tickets del usuario autenticado | Autenticado |
| GET | `/api/events/:eid/tickets` | Consulta los tickets de un evento | `organizer` (propietario), `admin` |
| PATCH | `/api/tickets/:tid/cancel` | Cancela un ticket | Propietario del ticket, `admin` |
| POST | `/api/sessions/register` | Registra un nuevo usuario | Público |
| POST | `/api/sessions/login` | Inicia sesión | Público |
| GET | `/api/sessions/current` | Obtiene el usuario autenticado | Autenticado |
| POST | `/api/sessions/logout` | Cierra la sesión | Público |
| GET | `/api/admin/users` | Consulta todos los usuarios | `admin` |

No se utiliza eliminación física de eventos ni de tickets.

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

## Manejo de errores

La API diferencia los siguientes códigos HTTP principales:

| Código | Significado |
|---|---|
| `400` | Datos inválidos o regla de negocio incumplida |
| `401` | Usuario no autenticado o credenciales inválidas |
| `403` | Usuario autenticado sin permisos |
| `404` | Recurso no encontrado |
| `409` | Conflicto o recurso duplicado |
| `500` | Error interno del servidor |

Todas las respuestas de error mantienen un formato consistente:

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

## Flujo principal de la aplicación

El flujo principal de una inscripción a un evento es:

```text
Usuario
   ↓
Login
   ↓
JWT en cookie
   ↓
Consulta eventos
   ↓
Evento publicado
   ↓
Selecciona equipo
   ↓
Ingresa contraseña del equipo
   ↓
Validación de capacidad
   ↓
Validación de inscripción duplicada
   ↓
Creación del Ticket
   ↓
Generación del código de reserva
   ↓
Envío de email
   ↓
Inscripción confirmada
```

## Seed de usuarios

Para facilitar las pruebas se incluye un script de seed:

```bash
npm run seed:users
```

Crea usuarios de prueba con los distintos roles disponibles (`user`, `organizer`, `admin`). Las contraseñas de estos usuarios se almacenan utilizando bcrypt, igual que en el registro normal.

## Pruebas realizadas

Las funcionalidades principales fueron verificadas mediante Postman.

**Autenticación y usuarios**

- Registro exitoso.
- Asignación automática del rol `user`.
- Intento de manipular el rol durante el registro.
- Campos obligatorios faltantes.
- Email inválido.
- Email duplicado.
- Contraseña almacenada mediante bcrypt.
- Contraseña excluida de las respuestas.
- Login exitoso.
- Login con credenciales inválidas.
- Current con sesión válida.
- Current sin autenticación.
- Logout.

**Roles y autorización**

- Usuario intentando crear un evento → 403.
- Organizer creando un evento → 201.
- Admin creando un evento → 201.
- Organizer modificando su propio evento → 200.
- Organizer modificando evento ajeno → 403.
- Admin modificando evento ajeno → 200.

**Reglas de negocio de Events**

- Crear evento con fecha pasada → 400.
- Crear evento con `teamsCapacity` o `playersPerTeam` en 0 → 400.
- Actualizar evento con capacidad en 0 → 400.
- Actualizar evento con precio negativo → 400.
- Publicar evento → 200.
- Intentar modificar evento cancelado → 400.
- Intentar cambiar el estado de un evento cancelado → 400.
- Intentar utilizar un estado inválido → 400.
- Intentar publicar un evento finalizado → 400.
- Consultar evento existente → 200.
- Consultar evento inexistente → 404.

**Equipos**

- Creación de equipos.
- Asignación automática de capitán al crear el equipo.
- Generación automática del ticket del capitán.
- Contraseña de equipo almacenada mediante bcrypt.
- Contraseña de equipo con menos de 6 caracteres → 400.
- Nombres de equipo únicos dentro de un mismo evento → 409.
- Crear equipo en un evento inexistente → 404.
- Organizer sin permisos (no dueño del evento) creando un equipo → 403.
- Crear equipo superando el `teamsCapacity` del evento → 400.
- Asignar como capitán a un usuario ya inscripto en el evento → 409.
- Consultar un equipo sin estar autenticado → 401.

**Tickets e inscripciones**

- Inscripción de jugadores en un equipo.
- Inscripción en un evento no publicado → 400.
- Inscripción en un equipo inexistente → 404.
- Inscripción con un equipo que no pertenece al evento → 400.
- Validación de la contraseña del equipo → 401 si es incorrecta.
- Control de jugadores por equipo (`playersPerTeam`) → 400 si está lleno.
- Prevención de inscripción duplicada del mismo usuario en un evento → 409.
- Consulta de tickets propios (`/api/tickets`).
- Consulta de tickets por evento, incluyendo cancelados.
- Cancelación de tickets.
- Intentar cancelar un ticket ya cancelado → 400.
- Conservación del historial de tickets cancelados.
- Liberación de cupos después de una cancelación.

**Capitanía de equipos**

- Transferencia automática de capitanía cuando el capitán cancela su ticket.
- Equipo sin jugadores activos: el equipo se conserva sin capitán.

**Notificaciones**

- Envío de email al confirmar una inscripción.
- Envío de email al cancelar una inscripción.

**DTO y seguridad de datos**

- La contraseña nunca se devuelve en las respuestas, ni siquiera cuando el usuario viene populado dentro de un ticket.

**Autenticación y autorización (generales)**

- Diferenciación entre errores 401 y 403.

**Listado de eventos**

Se verificaron:

- listado general;
- filtro por `status`;
- filtro por `category`;
- filtro por `location`;
- filtro por `dateFrom`;
- filtro por `dateTo`;
- combinación de filtros;
- paginación (`page`, `limit`, `total`, `totalPages`);
- ordenamiento mediante `sort`.

Ejemplo probado:

```http
GET /api/events?status=published&category=workshop&page=2&limit=5
```

## Seguridad

No subir al repositorio:

- `.env`
- `node_modules`
- Contraseñas
- Credenciales de MongoDB Atlas
- Secretos JWT

El archivo `.env` está incluido en `.gitignore`.

Las contraseñas se almacenan utilizando bcrypt y nunca se devuelven en las respuestas de la API.

Los JWT se firman utilizando la variable de entorno `JWT_SECRET`.

## Control de versiones

El proyecto utiliza Git para el control de versiones y GitHub como repositorio remoto.

Las entregas se organizan mediante commits correspondientes a cada etapa del desarrollo.

## Próximas etapas

Las siguientes funcionalidades pueden incorporarse sobre la base de la arquitectura actual:

- Listas de espera cuando un equipo o evento alcanza su capacidad máxima.
- Integración con pasarelas de pago para eventos con costo de inscripción.
- Documentación interactiva de la API (por ejemplo, con Swagger).
- Tests automatizados (unitarios y de integración) para services y repositories.
- Categorías de torneos y mejoras adicionales sobre la gestión de eventos.
- Integración con proveedores de autenticación externos.

## Estado del proyecto

Proyecto desarrollado como parte de Backend II. Esta versión corresponde a la Pre-entrega 8, que incorpora la arquitectura con DAO, Repository y DTO sobre la base funcional de entregas anteriores.
