# Backend TP Instagram

API REST desarrollada con Node.js, Express y PostgreSQL para reemplazar los mocks del frontend React (clon de Instagram) hecho en la etapa anterior del TP. Implementa registro, login, sesión con JSON Web Tokens, middlewares de validación y protección de endpoints sensibles.

## Arquitectura por capas

```
/src
  ├── /configs       --> Conexión a la base de datos (Pool de pg) usando variables de entorno.
  ├── /controllers    --> Reciben req/res, llaman a los services y arman la respuesta HTTP.
  ├── /middlewares    --> Verificación de JWT y validación de campos obligatorios.
  ├── /routes         --> Definición de endpoints, asociación con middlewares y controllers.
  ├── /services       --> Consultas SQL puras contra la base. No conocen req ni res.
  └── app.js          --> Inicialización de Express, CORS y montaje de rutas.
index.js               --> Carga variables de entorno y levanta el servidor.
```

Flujo de una petición protegida:

```
request → routes → authMiddleware (valida JWT) → validationMiddleware (valida body)
        → controller (orquesta) → service (consulta SQL) → controller → response
```

Cada capa tiene una única responsabilidad: las rutas solo enrutan, los middlewares interceptan, los controllers manejan la lógica de la petición HTTP (status codes, errores) y los services son los únicos que ejecutan SQL contra PostgreSQL.

## Modelo de datos (PostgreSQL)

Base de datos: `Instagram`. Dos tablas relacionadas 1 a N (un usuario tiene muchas publicaciones).

### Tabla `usuarios`

| Columna           | Tipo         | Restricciones           |
|-------------------|--------------|--------------------------|
| id                | SERIAL       | PRIMARY KEY              |
| nombre_usuario    | VARCHAR      | NOT NULL, UNIQUE         |
| nombre_completo   | VARCHAR      | NOT NULL                 |
| email             | VARCHAR      | NOT NULL, UNIQUE         |
| password          | VARCHAR      | NOT NULL (hash bcrypt)   |
| foto_perfil       | VARCHAR      | opcional                 |
| biografia         | TEXT         | opcional                 |

### Tabla `publicaciones`

| Columna         | Tipo      | Restricciones                                              |
|-----------------|-----------|--------------------------------------------------------------|
| id              | SERIAL    | PRIMARY KEY                                                   |
| usuario_id      | INTEGER   | NOT NULL, FOREIGN KEY → usuarios(id) ON DELETE CASCADE        |
| url_imagen      | VARCHAR   | NOT NULL                                                      |
| descripcion     | TEXT      | opcional                                                      |
| likes           | INTEGER   | DEFAULT 0                                                     |
| fecha_creacion  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP                                     |

El script completo de creación está en [dump-Instagram-202606290954.sql](dump-Instagram-202606290954.sql).

## Configuración y ejecución

1. Copiar `.env.example` a `.env` y completar con las credenciales locales:

   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=Instagram
   DB_USER=postgres
   DB_PASSWORD=...
   JWT_SECRET=...
   ```

2. Restaurar la base con el dump (`dump-Instagram-202606290954.sql`) en PostgreSQL (DBeaver, pgAdmin o `psql -f`).
3. Instalar dependencias y levantar el servidor:

   ```
   npm install
   node index.js
   ```

## Endpoints

Todas las respuestas son JSON. Las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

### Públicos

**POST `/api/auth/register`** — Registra un usuario nuevo.

Body:
```json
{
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Pérez",
  "email": "juan@mail.com",
  "password": "123456"
}
```
Respuesta `201`:
```json
{
  "message": "Usuario registrado con éxito",
  "user": { "id": 1, "nombre_usuario": "gato_programador", "email": "juan@mail.com" }
}
```
Errores: `400` si falta un campo, si el email/nombre de usuario ya existen o si el formato de email/password no es válido.

---

**POST `/api/auth/login`** — Valida credenciales y devuelve el token.

Body:
```json
{ "email": "juan@mail.com", "password": "123456" }
```
Respuesta `200`:
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "nombre_usuario": "gato_programador", "email": "juan@mail.com" }
}
```
Errores: `401` con `{ "error": "Credenciales inválidas" }` si el email no existe o la contraseña no coincide.

---

**GET `/api/publicaciones`** — Feed global de publicaciones, más nuevas primero.

Respuesta `200`:
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "url_imagen": "https://cataas.com/cat",
    "descripcion": "gato de prueba",
    "likes": 0,
    "fecha_creacion": "2026-07-13T08:53:05.144Z",
    "nombre_usuario": "gato_programador",
    "foto_perfil": null
  }
]
```

### Protegidos

**GET `/api/usuarios/perfil`** — Devuelve el perfil del usuario autenticado junto con sus publicaciones.

Respuesta `200`:
```json
{
  "id": 1,
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Pérez",
  "email": "juan@mail.com",
  "foto_perfil": null,
  "biografia": null,
  "publicaciones": [ { "id": 1, "usuario_id": 1, "url_imagen": "...", "descripcion": "...", "likes": 0, "fecha_creacion": "..." } ]
}
```
Errores: `401` si falta el token o es inválido/expiró, `404` si el usuario del token ya no existe.

---

**PUT `/api/usuarios/perfil`** — Edita nombre completo, biografía y/o foto de perfil del usuario autenticado.

Body:
```json
{
  "nombre_completo": "Juan Pérez",
  "biografia": "Amante de los gatos",
  "foto_perfil": "https://cataas.com/cat/avatar"
}
```
Respuesta `200`:
```json
{
  "message": "Perfil actualizado con éxito",
  "user": { "id": 1, "nombre_usuario": "gato_programador", "nombre_completo": "Juan Pérez", "biografia": "Amante de los gatos", "foto_perfil": "https://cataas.com/cat/avatar" }
}
```

---

**POST `/api/publicaciones`** — Crea una publicación para el usuario autenticado. El `usuario_id` se toma del token, nunca del body.

Body:
```json
{ "url_imagen": "https://cataas.com/cat", "descripcion": "Mi gato" }
```
Respuesta `201`:
```json
{
  "message": "Publicación creada con éxito",
  "post": { "id": 1, "usuario_id": 1, "url_imagen": "https://cataas.com/cat", "descripcion": "Mi gato", "likes": 0, "fecha_creacion": "2026-07-13T08:53:05.144Z" }
}
```
Errores: `400` si falta `url_imagen`, `401` si falta o es inválido el token.

## Autenticación con JWT

`authMiddleware` ([src/middlewares/authMiddleware.js](src/middlewares/authMiddleware.js)) intercepta las rutas protegidas:

1. Lee el header `Authorization` y valida que tenga el formato `Bearer <token>`; si no está, responde `401`.
2. Verifica la firma del token con `jwt.verify(token, process.env.JWT_SECRET)`.
3. Si es válido, decodifica el payload y lo cuelga en `req.user`, que los controllers usan para saber quién hace la petición.
4. Si la firma es inválida o el token expiró, responde `401`.

El token se emite en `login` ([src/controllers/authController.js](src/controllers/authController.js)) con:

```js
jwt.sign(
  { id: user.id, nombre_usuario: user.nombre_usuario, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '2h' }
)
```

El payload guarda únicamente `id`, `nombre_usuario` y `email` — nunca la contraseña, ni siquiera el hash. La expiración es de 2 horas. `JWT_SECRET` se define en `.env` y no se versiona.
