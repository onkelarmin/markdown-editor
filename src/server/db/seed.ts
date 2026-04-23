import "dotenv/config";
import { db } from "./client";
import { documents } from "./schema";
import { user } from "./auth-schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const now = Date.now();

  await db.delete(user);

  await db.insert(user).values({
    id: "user-1",
    name: "user-1-name",
    email: "user-1@test.com",
    emailVerified: true,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  await db.delete(documents);

  await db.insert(documents).values([
    {
      id: "doc-1",
      userId: "user-1",
      name: "Welcome.md",
      content: "# Welcome\n\nThis is your first document.",
      order: 1,
      createdAt: now,
      modifiedAt: now,
    },
    {
      id: "doc-2",
      userId: "user-1",
      name: "Second Note.md",
      content: "## Notes\n\n- Item 1\n- Item 2",
      order: 2,
      createdAt: now,
      modifiedAt: now,
    },
    {
      id: "doc-3",
      userId: "user-1",
      name: "Ideas.md",
      content: "Write down your ideas here...",
      order: 3,
      createdAt: now,
      modifiedAt: now,
    },
  ]);

  console.log("✅ Seeding complete");
}

seed().catch((error) => {
  console.error("❌ Seeding failed", error);
});
