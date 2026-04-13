import "dotenv/config";
import { db } from "./client";
import { documents, users } from "./schema";

async function seed() {
  console.log("🌱 Seeding database...");

  const now = Date.now();

  await db.delete(documents);
  await db.delete(users);

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

  await db
    .insert(users)
    .values([{ id: "demo-user-1", email: "demo@example.com" }]);

  console.log("✅ Seeding complete");
}

seed().catch((error) => {
  console.error("❌ Seeding failed", error);
});
