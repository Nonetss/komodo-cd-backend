# Backend Template - Hono + Better Auth + Drizzle

Template de backend moderno y listo para producción usando **Hono**, **Better Auth**, **Drizzle ORM** y **Bun**. Diseñado para trabajar en conjunto con el frontend [astro-template](https://github.com/Nonetss/astro-template).

## Características

- **[Hono](https://hono.dev/)**: Framework web ultrarrápido y ligero.
- **[Better Auth](https://www.better-auth.com/)**: Autenticación completa con soporte para email/password, OAuth y SSO.
- **[Drizzle ORM](https://orm.drizzle.team/)**: ORM tipado y seguro para TypeScript.
- **[OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)**: Especificación de API con `@hono/zod-openapi`.
- **[Scalar](https://scalar.com/)**: Documentación de API interactiva.
- **[Zod](https://zod.dev/)**: Validación de esquemas TypeScript-first.
- **[Bun](https://bun.sh/)**: Runtime de JavaScript ultrarrápido.
- **Docker Ready**: Listo para desplegar con Docker y Docker Compose.
- **SSO con Authentik**: Integración preconfigurada con proveedores OIDC.
- **Bootstrap automático**: Creación de usuario admin y configuración SSO al iniciar.

## Stack Completo

Este backend está diseñado para funcionar con:

| Componente   | Repositorio                                                         |
| ------------ | ------------------------------------------------------------------- |
| **Frontend** | [Nonetss/astro-template](https://github.com/Nonetss/astro-template) |
| **Backend**  | Este repositorio                                                    |

El frontend utiliza Astro 5 con Tailwind CSS 4, React y Shadcn UI, también dockerizado y listo para producción.

## Requisitos Previos

- [Bun](https://bun.sh/) instalado:

```bash
curl -fsSL https://bun.sh/install | bash
```

- PostgreSQL (o usar Docker Compose incluido)

## Instalación

1. Clona el repositorio:

```bash
git clone <tu-repo-url>
cd backend
```

2. Instala las dependencias:

```bash
bun install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
```

4. Edita el archivo `.env` con tus valores.

## Variables de Entorno

```env
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Better Auth
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="tu-secreto-seguro"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# SSO Authentik (opcional)
ENABLE_SSO="false"
SSO_SLUG_APP="tu-app-slug"
SSO_BASE_URL="https://tu-servidor-sso.com"
SSO_CLIENT_ID="tu-client-id"
SSO_CLIENT_SECRET="tu-client-secret"
SSO_DOMAIN="tu-dominio.com"

# Usuario Admin (bootstrap)
SEED_ADMIN_EMAIL="admin@example.com"
SEED_ADMIN_NAME="Admin"
SEED_ADMIN_PASSWORD="tu-password-seguro"
```

## Ejecución

### Desarrollo

Levanta la base de datos con Docker:

```bash
docker compose up -d
```

Ejecuta las migraciones:

```bash
bunx drizzle-kit migrate
```

Inicia el servidor de desarrollo:

```bash
bun run dev
```

El servidor estará disponible en `http://localhost:3000`.

### Bootstrap Automático

Al iniciar, el backend ejecuta automáticamente:

1. **Creación de usuario admin**: Si `SEED_ADMIN_EMAIL` está definido y el usuario no existe, lo crea.
2. **Configuración SSO**: Si `ENABLE_SSO=true`, registra o actualiza el proveedor SSO (Authentik).

## Documentación de la API

Una vez el servidor esté corriendo:

- **Scalar UI**: [http://localhost:3000/scalar](http://localhost:3000/scalar)
- **OpenAPI JSON**: [http://localhost:3000/doc](http://localhost:3000/doc)

## Autenticación

El backend expone los endpoints de Better Auth en `/api/auth/*`:

| Endpoint                   | Método | Descripción                 |
| -------------------------- | ------ | --------------------------- |
| `/api/auth/sign-up/email`  | POST   | Registro con email/password |
| `/api/auth/sign-in/email`  | POST   | Login con email/password    |
| `/api/auth/sign-in/social` | POST   | Login con OAuth (Google)    |
| `/api/auth/sign-out`       | POST   | Cerrar sesión               |
| `/api/auth/session`        | GET    | Obtener sesión actual       |

### SSO con Authentik

Para habilitar SSO:

1. Configura `ENABLE_SSO="true"` en tu `.env`
2. Añade las credenciales de tu aplicación en Authentik
3. Reinicia el servidor

## Base de Datos

### Migraciones con Drizzle

```bash
# Generar migraciones
bunx drizzle-kit generate

# Ejecutar migraciones
bunx drizzle-kit migrate

# Drizzle Studio (UI visual)
bunx drizzle-kit studio
```

### Esquema

El esquema incluye las tablas de Better Auth:

- `user` - Usuarios
- `session` - Sesiones activas
- `account` - Cuentas vinculadas (OAuth, credentials)
- `verification` - Tokens de verificación
- `sso_provider` - Proveedores SSO configurados

## Docker

### Desarrollo con Docker Compose

```bash
# Levantar solo PostgreSQL
docker compose up -d

# Ver logs
docker compose logs -f
```

### Producción

El `Dockerfile` incluido utiliza multi-stage builds optimizados para Bun:

```bash
# Construir imagen
docker build -t backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env backend
```

### Docker Compose Completo (Producción)

Para un despliegue completo con el frontend, crea un `compose.yml` en el directorio raíz:

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    env_file:
      - ./backend/.env
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    build: ./frontend
    ports:
      - "4321:4321"
    environment:
      - API_URL=http://backend:3000

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Estructura del Proyecto

```
src/
├── api/                 # Rutas de la API
│   ├── index.ts
│   └── v0/              # Versionado de API
├── core/                # Configuraciones del núcleo
│   └── config.ts        # Conexión a DB
├── db/                  # Base de datos
│   ├── auth.ts          # Configuración Better Auth
│   ├── index.ts
│   ├── models/          # Esquemas Drizzle
│   │   └── auth-schema.ts
│   └── relations.ts     # Relaciones entre tablas
├── lib/                 # Utilidades
│   ├── bootstrap.ts     # Inicialización automática
│   ├── seedAdmin.ts     # Script para crear admin
│   └── seedSSO.ts       # Script para configurar SSO
└── index.ts             # Punto de entrada
```

## Scripts Disponibles

| Script                      | Descripción                       |
| --------------------------- | --------------------------------- |
| `bun run dev`               | Inicia el servidor con hot reload |
| `bunx drizzle-kit generate` | Genera migraciones                |
| `bunx drizzle-kit migrate`  | Ejecuta migraciones               |
| `bunx drizzle-kit studio`   | Abre Drizzle Studio               |

## CI/CD

El proyecto incluye GitHub Actions para:

- Build automático de imagen Docker
- Push a registry en cada merge a `main`

Ver `.github/workflows/docker-build.yml` para configuración.
