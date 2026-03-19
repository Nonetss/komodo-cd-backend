# Komodo Backend

> Parte de [Komodo CD](https://github.com/Nonetss/komodo-cd-backend). Frontend en [Nonetss/komodo-cd-frontend](https://github.com/Nonetss/komodo-cd-frontend).

API REST para gestionar y disparar deploys sobre stacks de [Komodo](https://komo.do) desde GitHub Actions, Gitea Actions o cualquier cliente HTTP. Construida con **Hono** + **Bun**, autenticación con **Better Auth** y persistencia en **SQLite** via Drizzle ORM.

## Stack

- **[Bun](https://bun.sh/)** — Runtime y gestor de paquetes
- **[Hono](https://hono.dev/)** + [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) — Framework web con validación y OpenAPI
- **[Better Auth](https://www.better-auth.com/)** — Autenticación: email/password y API Keys
- **[Drizzle ORM](https://orm.drizzle.team/)** + **[libsql](https://github.com/tursodatabase/libsql)** — ORM tipado sobre SQLite
- **[Komodo Client](https://komo.do)** — Cliente oficial para interactuar con la plataforma Komodo
- **[Scalar](https://scalar.com/)** — Documentación interactiva OpenAPI

## Endpoints

| Método   | Ruta                         | Auth             | Descripción                                      |
| -------- | ---------------------------- | ---------------- | ------------------------------------------------ |
| `POST`   | `/api/v0/deploy`             | API Key / sesión | Dispara una acción sobre un stack                |
| `GET`    | `/api/v0/stacks`             | API Key / sesión | Lista los stacks con estado, servicios y commits |
| `GET`    | `/api/v0/history`            | sesión           | Historial de acciones con usuario                |
| `GET`    | `/api/v0/apikeys`            | sesión           | Lista las API Keys del usuario                   |
| `POST`   | `/api/v0/apikeys`            | sesión           | Crea una nueva API Key                           |
| `DELETE` | `/api/v0/apikeys`            | sesión           | Elimina una API Key                              |
| `GET`    | `/api/v0/deploy/credentials` | sesión           | Lista las credenciales de Komodo                 |
| `POST`   | `/api/v0/deploy/credentials` | sesión           | Guarda una credencial de Komodo                  |
| `DELETE` | `/api/v0/deploy/credentials` | sesión           | Elimina una credencial de Komodo                 |
| `GET`    | `/health-check`              | —                | Health check                                     |
| `GET`    | `/scalar`                    | —                | Documentación interactiva                        |
| `GET`    | `/doc`                       | —                | OpenAPI JSON                                     |

### Acciones de deploy

| Acción          | Descripción                              |
| --------------- | ---------------------------------------- |
| `pull`          | Pull de la imagen sin reiniciar el stack |
| `redeploy`      | Detiene y vuelve a levantar el stack     |
| `pull-redeploy` | Pull de imagen + redeploy completo       |

## Desarrollo

```bash
bun install
cp .env.example .env
# Editar .env con tus valores
bun dev
```

El servidor arranca en `http://localhost:3000`.
Las migraciones y el usuario admin se aplican automáticamente al iniciar.

Si cambias el schema de la BD, genera una nueva migración:

```bash
bunx drizzle-kit generate
```

## Variables de entorno

| Variable              | Requerida | Descripción                                                        |
| --------------------- | --------- | ------------------------------------------------------------------ |
| `DATABASE_URL`        | ✅        | Ruta SQLite. Dev: `file:./dev.db` · Docker: `file:/data/db.sqlite` |
| `BETTER_AUTH_SECRET`  | ✅        | Secreto para firmar sesiones. `openssl rand -base64 32`            |
| `BETTER_AUTH_URL`     | ✅        | URL pública del frontend. Para CORS y trusted origins              |
| `SEED_ADMIN_EMAIL`    | —         | Email del admin que se crea al arrancar si no existe               |
| `SEED_ADMIN_NAME`     | —         | Nombre del admin inicial                                           |
| `SEED_ADMIN_PASSWORD` | —         | Contraseña del admin inicial                                       |

## Uso desde CI/CD

La autenticación se hace con una API Key pasada en el header `x-api-key`. Las keys se generan desde el dashboard del frontend.

```bash
curl -X POST https://app.example.com/api/v0/deploy \
  -H "x-api-key: <tu-api-key>" \
  -H "Content-Type: application/json" \
  -d '{"stack":"mi-stack","action":"pull-redeploy"}'
```

### GitHub Actions

```yaml
- name: Deploy
  run: |
    curl -X POST ${{ secrets.APP_URL }}/api/v0/deploy \
      -H "x-api-key: ${{ secrets.KOMODO_API_KEY }}" \
      -H "Content-Type: application/json" \
      -d '{"stack":"${{ vars.STACK_NAME }}","action":"pull-redeploy"}'
```

**Secrets necesarios:**

- `APP_URL` — URL pública de la app (ej: `https://app.example.com`)
- `KOMODO_API_KEY` — API Key generada desde el dashboard

## Docker

La imagen expone el puerto `3000` y espera un volumen en `/data` para la BD SQLite.

```bash
docker build -t komodo-backend .

docker run -d \
  -p 3000:3000 \
  -v komodo_data:/data \
  -e BETTER_AUTH_SECRET=<secreto> \
  -e BETTER_AUTH_URL=https://app.example.com \
  -e SEED_ADMIN_EMAIL=admin@example.com \
  -e SEED_ADMIN_PASSWORD=<password> \
  komodo-backend
```

O con el `docker-compose.yml` del repositorio raíz (recomendado):

```bash
cp ../.env.example ../.env
# Editar ../.env
docker compose -f ../docker-compose.yml up -d --build
```

## Estructura

```
src/
├── api/v0/
│   ├── deploy/
│   │   ├── trigger/          # POST /deploy — dispara acciones
│   │   └── credentials/      # CRUD credenciales de Komodo
│   ├── stacks/               # GET /stacks — estado de los stacks
│   ├── history/              # GET /history — historial de acciones
│   └── apikeys/              # CRUD API Keys
├── core/
│   ├── auth.ts               # Configuración de Better Auth
│   └── config.ts             # Cliente de BD (Drizzle + libsql)
├── db/models/                # Schemas de Drizzle
├── lib/
│   ├── bootstrap.ts          # Migraciones + seed admin al arrancar
│   └── logger.ts
├── middleware.ts              # Auth: sesión por cookie y API Key
└── services/
    └── komodo.ts             # Cliente de Komodo (PullStack, DeployStack)
drizzle/                      # Migraciones SQL generadas
```
