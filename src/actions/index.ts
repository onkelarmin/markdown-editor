import { DEMO_USER_ID } from "@/server/config";
import { defineAction } from "astro:actions";
import { db, Document, eq } from "astro:db";

export const server = {
  getDocuments: defineAction({
    handler: async () => {
      const userId = DEMO_USER_ID;

      const rows = await db
        .select()
        .from(Document)
        .where(eq(Document.userId, userId));

      const documents = rows.map((row) => ({
        id: row.id,
        name: row.name,
        content: row.content,
        createdAt: row.createdAt,
        modifiedAt: row.modifiedAt,
      }));

      return documents;
    },
  }),
  // saveDocument: defineAction({
  //   handler: async () => {
  //     const docs = await db.select().from(Document);

  //     return docs;
  //   },
  // }),
};
