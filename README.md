# komodo-action

Backend para automatizar deploys en **Komodo** desde webhooks de GitHub/Gitea. Construido con **Hono**, **Better Auth**, **Drizzle ORM** y **Bun**.

## Stack

- **[Hono](https://hono.dev/)** — Framework web ultrarrápido
- **[Better Auth](https://www.better-auth.com/)** — Autenticación con email/password y OAuth
- **[Drizzle ORM](https://orm.drizzle.team/)** — ORM tipado para TypeScript
- **[SQLite (libsql)](https://github.com/tursodatabase/libsql)** — Base de datos local
- **[Komodo Client](https://komo.do)** — Cliente oficial de Komodo
- **[Bun](https://bun.sh/)** — Runtime JavaScript ultrarrápido

## Instalación

```bash
bun install
cp .env.example .env
# Edita .env con tus valores
bun run dev
```

Las migraciones se aplican automáticamente al arrancar.

## Variables de Entorno

```env
DATABASE_URL="file:./dev.db"

BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="tu-secreto-seguro"

SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_NAME="Admin"
SEED_ADMIN_PASSWORD="tu-password-seguro"
```

## Integración con Komodo

### 1. Guardar credenciales de Komodo

Después de iniciar el servidor, guarda tus credenciales de Komodo (se almacenan en la BD):

```bash
curl -X POST http://localhost:3000/api/v0/deploy/credentials \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "name": "production",
    "url": "https://tu-komodo.com",
    "key": "tu-api-key",
    "secret": "tu-api-secret"
  }'
```

### 2. Trigger de deploy (GitHub Actions / Gitea)

Envía una petición con el token de Better Auth y el stack a desplegar:

```bash
curl -X POST http://localhost:3000/api/v0/deploy/trigger \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu-token>" \
  -d '{
    "stack": "mi-stack",
    "action": "build-pull-redeploy"
  }'
```

**Acciones disponibles:**

- `build` — Solo build de la imagen
- `pull` — Solo pull de la imagen
- `redeploy` — Solo redeploy del stack
- `build-pull-redeploy` — Pipeline completo

### Workflow GitHub Actions

```yaml
name: Deploy to Komodo

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deploy
        run: |
          curl -X POST ${{ secrets.BACKEND_URL }}/api/v0/deploy/trigger \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.BACKEND_TOKEN }}" \
            -d '{
              "stack": "${{ vars.KOMODO_STACK }}",
              "action": "build-pull-redeploy"
            }'
```

### Workflow Gitea Actions

```yaml
name: Deploy to Komodo

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deploy
        run: |
          curl -X POST ${{ secrets.BACKEND_URL }}/api/v0/deploy/trigger \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${{ secrets.BACKEND_TOKEN }}" \
            -d '{
              "stack": "${{ vars.KOMODO_STACK }}",
              "action": "build-pull-redeploy"
            }'
```

**Secrets necesarios en el repositorio:**

- `BACKEND_URL` — URL de este backend (ej: `https://tu-backend.com`)
- `BACKEND_TOKEN` — Token de sesión de Better Auth
- `KOMODO_STACK` — Nombre del stack en Komodo

## Endpoints de Deploy

| Método   | Endpoint                            | Descripción                    |
| -------- | ----------------------------------- | ------------------------------ |
| `POST`   | `/api/v0/deploy/trigger`            | Disparar un deploy             |
| `POST`   | `/api/v0/deploy/credentials`        | Guardar credenciales de Komodo |
| `GET`    | `/api/v0/deploy/credentials-list`   | Listar credenciales            |
| `DELETE` | `/api/v0/deploy/credentials-delete` | Eliminar credenciales          |

## Endpoints de Auth (Better Auth)

| Endpoint                  | Método | Descripción              |
| ------------------------- | ------ | ------------------------ |
| `/api/auth/sign-in/email` | POST   | Login con email/password |
| `/api/auth/sign-up/email` | POST   | Registro                 |
| `/api/auth/sign-out`      | POST   | Cerrar sesión            |
| `/api/auth/session`       | GET    | Sesión actual            |

## Documentación API

Con el servidor corriendo:

- **Scalar UI**: [http://localhost:3000/scalar](http://localhost:3000/scalar)
- **OpenAPI JSON**: [http://localhost:3000/doc](http://localhost:3000/doc)

## Estructura del Proyecto

```
src/
├── api/
│   ├── index.ts
│   └── v0/
│       └── deploy/
│           ├── trigger/       # POST — trigger deploy
│           ├── credentials/   # POST — guardar credenciales
│           ├── credentials-list/   # GET — listar
│           └── credentials-delete/ # DELETE — eliminar
├── core/
│   └── config.ts              # Conexión a SQLite
├── db/
│   ├── index.ts
│   ├── models/
│   │   ├── auth-schema.ts     # Tablas de Better Auth
│   │   └── komodo.table.ts    # Tabla de credenciales Komodo
│   └── relations.ts
├── lib/
│   ├── bootstrap.ts           # Migraciones + admin + komodo init
│   └── logger.ts
├── services/
│   └── komodo.ts              # Cliente de Komodo
└── index.ts
```

## Scripts de Generación

```bash
# Endpoint individual
bun run post resources/create

# CRUD completo
bun run crud resources

# Tabla de BD
bun run gen:table nombre_tabla

# Endpoint SSE
bun run sse events/live
```

## Desarrollo

```bash
bun run dev          # Servidor con hot reload
bun drizzle-kit push # Aplicar esquema a la BD
bun drizzle-kit studio # Abrir Drizzle Studio
```
