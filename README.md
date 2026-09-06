# Plataforma de Torneos Deportivos

## Pre-entrega 6 — Entidad events y lógica de negocio

Esta entrega incorpora la entidad `Event` y completa la gestión de eventos
deportivos mediante operaciones de creación, consulta, modificación y
actualización de estado.

La lógica de negocio se concentra en la capa de Services, mientras que el
acceso a MongoDB se mantiene separado mediante Repository y DAO.

La autenticación mediante Passport.js, JWT y cookies, junto con el sistema
de roles y autorización implementado en las entregas anteriores, se mantiene
como base del sistema.

## Temática

La plataforma está orientada a la gestión de **torneos y eventos deportivos**.

Roles:

- `admin`: administración general.
- `organizer`: creación y administración de sus propios eventos.
- `user`: consulta de eventos.

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

La variable `MONGO_URL` debe contener la cadena de conexión de MongoDB Atlas.
`JWT_SECRET` se utiliza para firmar y verificar los tokens JWT.
`JWT_EXPIRES_IN` define el tiempo de expiración del JWT.
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
│   │   └── sessions.router.js         → define las rutas de autenticación.
│   ├── controllers/
│   │   ├── events.controller.js       → maneja las solicitudes y respuestas de eventos.
│   │   ├── sessions.controller.js     → maneja las respuestas de autenticación.
│   │   └── users.controller.js        → maneja la consulta de usuarios.
│   ├── services/
│   │   └── events.service.js          → contiene la lógica de negocio de eventos.
│   ├── repositories/
│   │   ├── events.repository.js       → comunica la aplicación con el DAO de eventos.
│   │   └── users.repository.js        → comunica la aplicación con el DAO de usuarios.
│   ├── dao/
│   │   ├── events.dao.js              → realiza operaciones sobre eventos.
│   │   └── users.dao.js               → realiza operaciones sobre usuarios.
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
```

## Arquitectura

La aplicación utiliza una arquitectura por capas:

**Route → Middleware → Controller → Service → Repository → DAO → Model → MongoDB Atlas**

Cada capa tiene una responsabilidad específica:

- **Routes:** reciben las solicitudes HTTP y determinan qué middlewares y controllers ejecutar.
- **Middlewares:** validan autenticación y autorización antes de llegar al controller.
- **Controllers:** reciben la solicitud, ejecutan la operación correspondiente y construyen la respuesta HTTP.
- **Services:** contienen la lógica de negocio y las validaciones propias de la aplicación.
- **Repositories:** funcionan como una capa intermedia entre los Services y el DAO.
- **DAO:** realiza las operaciones directamente sobre los modelos de MongoDB.
- **Models:** definen la estructura de los documentos almacenados en MongoDB.

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
| `capacity` | Number | Capacidad máxima |
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
  "capacity": 50,
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

La capacidad debe ser mayor a 0. Si se envía `{ "capacity": 0 }`:

Código HTTP: `400 Bad Request`

```json
{
  "status": "error",
  "message": "La capacidad debe ser mayor a 0"
}
```

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

## Roles y autorización

La API utiliza tres roles:

- `user` → usuario registrado. Puede consultar eventos.
- `organizer` → puede consultar eventos, crear eventos, modificar sus propios eventos y actualizar su estado.
- `admin` → puede consultar eventos, crear eventos, modificar cualquier evento, actualizar el estado de cualquier evento y consultar todos los usuarios.

### Matriz de permisos

| Acción | user | organizer | admin |
|---|---:|---:|---:|
| Consultar eventos | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Actualizar estado de eventos propios | ❌ | ✅ | ✅ |
| Actualizar estado de cualquier evento | ❌ | ❌ | ✅ |
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
| POST | `/api/sessions/register` | Registra un nuevo usuario | Público |
| POST | `/api/sessions/login` | Inicia sesión | Público |
| GET | `/api/sessions/current` | Obtiene el usuario autenticado | Autenticado |
| POST | `/api/sessions/logout` | Cierra la sesión | Público |
| GET | `/api/admin/users` | Consulta todos los usuarios | `admin` |

No se utiliza eliminación física de eventos.

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
- Crear evento con capacidad 0 → 400.
- Actualizar evento con capacidad 0 → 400.
- Actualizar evento con precio negativo → 400.
- Publicar evento → 200.
- Intentar modificar evento cancelado → 400.
- Intentar cambiar el estado de un evento cancelado → 400.
- Intentar utilizar un estado inválido → 400.
- Intentar publicar un evento finalizado → 400.
- Consultar evento existente → 200.
- Consultar evento inexistente → 404.

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

Las siguientes funcionalidades pueden incorporarse sobre la base de la entidad `Event`:

- Inscripciones a eventos.
- Control de cupos.
- Gestión de participantes.
- Tickets.
- Notificaciones.
- Categorías.
- Integración con proveedores de autenticación externos.
- Mejoras y extensiones de la gestión de torneos.
