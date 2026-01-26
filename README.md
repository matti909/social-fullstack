# NgSocial - Red Social Fullstack

Una aplicación de red social fullstack construida con Angular 21 y Node.js/Express con GraphQL.

## Tecnologías

### Frontend
- Angular 21
- Angular Material
- Apollo Client (GraphQL)
- RxJS

### Backend
- Node.js + Express
- Apollo Server (GraphQL)
- TypeORM
- MySQL
- JWT para autenticación
- AWS SDK (para almacenamiento de archivos)

## Estructura del Proyecto

```
social-fullstack/
├── packages/
│   ├── client/              # Aplicación Angular (Frontend)
│   │   └── src/
│   │       └── app/
│   │           ├── core/        # Servicios base, guards, interceptors
│   │           ├── pages/       # Páginas/rutas de la aplicación
│   │           └── shared/      # Componentes compartidos
│   │
│   ├── server/              # API GraphQL (Backend)
│   │   ├── src/
│   │   │   ├── config/      # Configuración de la base de datos
│   │   │   ├── entity/      # Entidades TypeORM
│   │   │   └── graphql/     # Resolvers y esquemas GraphQL
│   │   ├── docker-compose.yml
│   │   └── Dockerfile
│   │
│   └── graphql-types/       # Tipos GraphQL compartidos
│
├── pnpm-workspace.yaml      # Configuración del monorepo
└── package.json
```

## Requisitos Previos

- Node.js (v18+)
- pnpm
- Docker y Docker Compose

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repo>
cd social-fullstack
```

2. Instalar dependencias:
```bash
pnpm install
```

## Ejecutar el Backend

1. Navegar a la carpeta del servidor:
```bash
cd packages/server
```

2. Crear archivo `.env` con las variables de entorno:
```env
MYSQL_DATABASE=ngsocial
MYSQL_ROOT_USER=root
MYSQL_ROOT_PASSWORD=your_password
MYSQL_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

3. Iniciar los servicios con Docker Compose:
```bash
docker-compose up -d
```

Esto levantará:
- Base de datos MySQL en el puerto `3312`
- API GraphQL en el puerto `4000`

4. Verificar que los servicios estén corriendo:
```bash
docker-compose ps
```

### Ejecutar el Backend sin Docker (desarrollo local)

```bash
cd packages/server
pnpm start
```

## Ejecutar el Frontend

1. Navegar a la carpeta del cliente:
```bash
cd packages/client
```

2. Iniciar el servidor de desarrollo:
```bash
pnpm start
```

3. Abrir el navegador en `http://localhost:4200`

## Scripts Disponibles

### Cliente (Frontend)
| Comando | Descripción |
|---------|-------------|
| `pnpm start` | Inicia el servidor de desarrollo |
| `pnpm build` | Compila la aplicación para producción |
| `pnpm test` | Ejecuta los tests |

### Servidor (Backend)
| Comando | Descripción |
|---------|-------------|
| `pnpm start` | Inicia el servidor en modo desarrollo |
| `pnpm build` | Compila TypeScript a JavaScript |
| `pnpm schema:sync` | Sincroniza el esquema de la base de datos |
| `pnpm seed:run` | Ejecuta los seeders |

## API GraphQL

Una vez iniciado el backend, puedes acceder al playground de GraphQL en:
```
http://localhost:4000/graphql
```

## Funcionalidades

- Registro e inicio de sesión de usuarios
- Crear, editar y eliminar publicaciones
- Sistema de likes
- Comentarios en publicaciones
- Perfil de usuario con foto y portada
- Feed de publicaciones
