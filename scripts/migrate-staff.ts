import { existsSync } from "fs";
import { join } from "path";
import db from "../src/db";
import { staffTable } from "../src/db/schema";

const REMOTE_URL =
  "https://do3lcit1p1.execute-api.us-east-1.amazonaws.com/staff";
const UPLOADS_DIR = join(import.meta.dir, "../data/uploads");

interface RemoteStaff {
  name: string;
  author?: string;
  description?: string;
  coverImageUrl?: string;
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
  console.log("Fetching staff from remote API...");
  const response = await fetch(REMOTE_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const remoteStaff: RemoteStaff[] = data.staffMembers;
  console.log(`Fetched ${remoteStaff.length} staff members`);

  const toInsert = remoteStaff.map((member) => {
    let coverImageUrl: string | undefined;
    if (member.coverImageUrl) {
      const filename = extractFilename(member.coverImageUrl);
      if (!checkFileExists(filename)) {
        console.warn(`  WARN: missing cover image for "${member.name}": ${filename}`);
      }
      coverImageUrl = filename;
    }

    return {
      name: member.name,
      author: member.author ?? null,
      description: member.description ?? null,
      coverImageUrl,
      createdAt: member.createdAt ?? null,
      updatedAt: member.updatedAt ?? null,
    };
  });

  console.log(`\nInserting ${toInsert.length} staff members...`);
  await db.insert(staffTable).values(toInsert);
  console.log("Done! Staff migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
