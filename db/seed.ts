import { db, Document, User } from "astro:db";

const now = Date.now();

// https://astro.build/db/seed
export default async function seed() {
  await db.delete(Document);
  await db.insert(Document).values([
    {
      id: "doc-1",
      userId: "demo-user-1",
      name: "Welcome.md",
      content: "# Hello world",
      createdAt: now,
      modifiedAt: now,
    },
  ]);

  await db.delete(User);
  await db
    .insert(User)
    .values([{ id: "demo-user-1", email: "demo@example.com" }]);
}
