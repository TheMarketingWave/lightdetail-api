# LightDetail API

A REST API backend for managing project portfolios, staff information, and image uploads. Built with Hono.js, TypeScript, and Bun.

## Tech Stack

- **Runtime**: Bun
- **Framework**: Hono.js
- **Language**: TypeScript
- **Database**: SQLite with LibSQL
- **ORM**: Drizzle ORM
- **Authentication**: Better Auth
- **API Docs**: Scalar OpenAPI
- **Validation**: Zod
- **Image Processing**: Sharp

## Installation

```sh
bun install
```

## Development

```sh
bun run dev
```

Open http://localhost:3001

## Environment Variables

Create a `.env` file:

```env
NODE_ENV=development
PORT=3001
LOG_LEVEL=warn
DATABASE_URL=file:data/dev.db
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3001
```

## API Endpoints

### Projects

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /projects | No | List all projects |
| GET | /projects/{id} | No | Get project by ID |
| GET | /projects/type/{type} | No | Filter by type (residential/commercial) |
| POST | /projects | Admin | Create project |
| PATCH | /projects/{id} | Admin | Update project |
| DELETE | /projects/{id} | Admin | Delete project |
| PATCH | /projects/order | Admin | Reorder projects |

### Staff

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /staff | No | List all staff |
| POST | /staff | Admin | Create staff |
| PATCH | /staff/{id} | Admin | Update staff |
| DELETE | /staff/{id} | Admin | Delete staff |

### Images

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /images | No | Upload image |
| GET | /images/{filename} | No | Retrieve image |

### Authentication

All auth endpoints are available under `/api/auth/*` via Better Auth.

## API Documentation

Interactive API documentation is available at:
- `/reference` - Scalar API docs
- `/doc` - OpenAPI specification

## Database

Run migrations:
```sh
bunx drizzle-kit migrate
```

Open database studio:
```sh
bunx drizzle-kit studio
```

## Project Structure

```
src/
├── index.ts          # Server entry point
├── app.ts            # App initialization
├── env.ts            # Environment validation
├── lib/              # Core utilities
├── db/               # Database schema and migrations
├── middlewares/      # Hono middlewares
└── routes/           # API route definitions
    ├── projects/     # Project CRUD
    ├── staff/        # Staff CRUD
    └── images/       # Image upload/retrieval
```

## Docker

Build and run:
```sh
docker build -t lightdetail-api .
docker run -p 3001:3001 lightdetail-api
```

## License

MIT
