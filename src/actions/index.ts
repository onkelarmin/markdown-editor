import { documentNameSchemaFull } from "@/scripts/features/markdown/schema";
import { DEMO_USER_ID } from "@/server/config";
import { z } from "astro/zod";
import { defineAction } from "astro:actions";
import { and, db, Document, eq } from "astro:db";

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
  saveDocument: defineAction({
    input: z.object({
      id: z.string(),
      name: documentNameSchemaFull,
      content: z.string(),
      modifiedAt: z.number(),
      userId: z.string(),
    }),
    handler: async ({ id, name, content, modifiedAt, userId }) => {
      await db
        .update(Document)
        .set({ name, content, modifiedAt })
        .where(and(eq(Document.id, id), eq(Document.userId, userId)));

      return { success: true, id };
    },
  }),
};
