import { existsSync } from "fs";
import { join } from "path";
import db from "../src/db";
import { projectsTable } from "../src/db/schema";

const REMOTE_URL =
  "https://do3lcit1p1.execute-api.us-east-1.amazonaws.com/projects/all";
const UPLOADS_DIR = join(import.meta.dir, "../data/uploads");

interface RemoteProject {
  title: string;
  type: string;
  coverImageUrl?: string;
  description?: string;
  latestPosition?: number;
  tags?: string[];
  imgs?: string[];
  createdAt?: number;
  updatedAt?: number;
}

function extractFilename(s3Url: string): string {
  return s3Url.split("/").pop() ?? s3Url;
}

function checkFileExists(filename: string): boolean {
  return existsSync(join(UPLOADS_DIR, filename));
}

async function main() {
  console.log("Fetching projects from remote API...");
  const response = await fetch(REMOTE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const remoteProjects: RemoteProject[] = data.projects;
  console.log(`Fetched ${remoteProjects.length} projects`);

  // Filter out visualisation projects
  const filtered = remoteProjects.filter((p) => p.type !== "visualisation");
  console.log(
    `After filtering: ${filtered.length} projects (skipped ${remoteProjects.length - filtered.length} visualisation)`
  );

  const toInsert = filtered.map((project, index) => {
    // Transform cover image URL
    let coverImageUrl: string | undefined;
    if (project.coverImageUrl) {
      const filename = extractFilename(project.coverImageUrl);
      if (!checkFileExists(filename)) {
        console.warn(`  WARN: missing cover image for "${project.title}": ${filename}`);
      }
      coverImageUrl = filename;
    }

    // Transform image URLs
    const imgs = (project.imgs ?? []).map((url) => {
      const filename = extractFilename(url);
      if (!checkFileExists(filename)) {
        console.warn(`  WARN: missing image for "${project.title}": ${filename}`);
      }
      return filename;
    });

    return {
      title: project.title,
      type: project.type as "residential" | "commercial",
      coverImageUrl,
      description: project.description ?? null,
      latestPosition: project.latestPosition ?? null,
      tags: project.tags ?? [],
      imgs,
      createdAt: project.createdAt ?? null,
      updatedAt: project.updatedAt ?? null,
      order: filtered.length - index, // first project gets highest order
    };
  });

  console.log(`\nInserting ${toInsert.length} projects...`);
  await db.insert(projectsTable).values(toInsert);
  console.log("Done! Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
