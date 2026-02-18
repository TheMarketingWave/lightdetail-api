# Data Migration Plan: Remote API → Local SQLite DB

## Context

- **Remote API**: 41 projects at `https://do3lcit1p1.execute-api.us-east-1.amazonaws.com/projects/all`
- **Local DB**: SQLite with `projectsTable` (integer autoIncrement PK)
- **Local images**: 469 files in `data/uploads/` named by UUID (e.g., `ac9e3241-...jpeg`)
- **Remote image URLs**: S3 URLs like `https://idesign-imgs.s3.amazonaws.com/{uuid}.jpeg`

## Key Mapping Issue

- Remote projects use **UUID** ids; local DB uses **auto-increment integers**
- Image filenames on disk already match the UUID portion of the S3 URLs

## Plan

### Step 1: Create a migration script (`scripts/migrate-projects.ts`)

A single Bun script that:

1. **Fetches** all projects from the remote endpoint
2. **Transforms** each project:
   - Extracts filename from S3 URL for `coverImageUrl` (e.g., `ac9e3241-...jpeg`)
   - Extracts filenames from S3 URLs for each entry in `imgs` array
   - Verifies each image file exists in `data/uploads/` (logs warnings for missing)
   - Keeps `title`, `type`, `description`, `latestPosition`, `tags`, `createdAt`, `updatedAt`
3. **Inserts** all projects into the DB via Drizzle ORM
4. **Sets `order`** based on the remote project ordering (position in the array)

### Step 2: Run & verify

- Run: `bun scripts/migrate-projects.ts`
- Verify with `bunx drizzle-kit studio` or by hitting `GET /projects/all`

## What the script does NOT do

- Does not touch image files (they're already downloaded with correct names)
- Does not modify the schema (fields map 1:1)
- Does not handle the old UUID-based project IDs (they're discarded; new integer IDs are assigned)
