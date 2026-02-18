# LightDetail API

A REST API backend for managing project portfolios, staff information, image/video uploads, and CMS content. Built with Hono.js, TypeScript, and Bun.

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
| POST | /images/upload | No | Upload image (auto-converts to WebP) |
| GET | /images/get/{id} | No | Retrieve image |
| DELETE | /images/delete/{id} | No | Delete image |

### Videos

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /videos/upload | No | Upload video (mp4, webm, mov — 50MB limit) |
| GET | /videos/get/{id} | No | Retrieve video |
| DELETE | /videos/delete/{id} | No | Delete video |

### Content (CMS)

Hierarchical content storage for website sections, text, images, and videos.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /content | No | Flat list of all content |
| GET | /content/tree | No | Full nested tree structure |
| GET | /content/tree/{key} | No | Subtree rooted at a specific key |
| GET | /content/{id} | No | Single item by ID |
| POST | /content/add | No | Create content item |
| PUT | /content/update/{id} | No | Update content item |
| DELETE | /content/delete/{id} | No | Delete item + cascade children |
| PUT | /content/order | No | Bulk reorder siblings |

Content types: `text`, `image`, `video`, `section`, `list`. Items can be nested under `section` or `list` parents to arbitrary depth. Each item has a globally unique `key` and an optional `metadata` JSON field for type-specific data.

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
    ├── images/       # Image upload/retrieval
    ├── videos/       # Video upload/retrieval
    └── content/      # CMS content tree CRUD
```

## Docker

Build and run:
```sh
docker build -t lightdetail-api .
docker run -p 3001:3001 lightdetail-api
```

## License

MIT
