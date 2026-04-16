import { db } from "@/server/db/client";
import { and, eq, gt, sql } from "drizzle-orm";
import { documents } from "@/server/db/schema";
import { documentNameSchemaFull } from "@/scripts/features/markdown/schema";
import { DEMO_USER_ID } from "@/server/config";
import { z } from "astro/zod";
import { ActionError, defineAction } from "astro:actions";
import { getNewDocumentName } from "@/scripts/features/markdown/lib/getNewDocumentName";

export const server = {
  createDocument: defineAction({
    input: z.object({
      id: z.string(),
      name: documentNameSchemaFull,
      content: z.string(),
      order: z.number().positive(),
      createdAt: z.number(),
      modifiedAt: z.number(),
      userId: z.string(),
    }),

    handler: async ({
      id,
      name,
      content,
      order,
      createdAt,
      modifiedAt,
      userId,
    }) => {
      await db
        .insert(documents)
        .values({ id, name, content, order, createdAt, modifiedAt, userId });

      return { id };
    },
  }),

  getDocuments: defineAction({
    handler: async () => {
      const userId = DEMO_USER_ID;

      const rows = await db
        .select()
        .from(documents)
        .where(eq(documents.userId, userId))
        .orderBy(documents.order);

      const loaded = rows.map((row) => ({
        id: row.id,
        name: row.name,
        content: row.content,
        order: row.order,
        createdAt: row.createdAt,
        modifiedAt: row.modifiedAt,
      }));

      return loaded;
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
        .update(documents)
        .set({ name, content, modifiedAt })
        .where(and(eq(documents.id, id), eq(documents.userId, userId)));

      return { id };
    },
  }),

  reorderDocuments: defineAction({
    input: z.object({
      reordered: z.array(
        z.object({
          id: z.string(),
          order: z.number(),
          userId: z.string(),
        }),
      ),
    }),

    handler: async ({ reordered }) => {
      await db.transaction(async (tx) => {
        reordered.forEach(async (document) => {
          await tx
            .update(documents)
            .set({ order: document.order })
            .where(
              and(
                eq(documents.id, document.id),
                eq(documents.userId, document.userId),
              ),
            );
        });
      });
    },
  }),

  deleteDocument: defineAction({
    input: z.object({ id: z.string(), userId: z.string() }),

    handler: async ({ id, userId }) => {
      const result = await db.transaction(async (tx) => {
        const [documentToDelete] = await tx
          .select({ id: documents.id, order: documents.order })
          .from(documents)
          .where(and(eq(documents.id, id), eq(documents.userId, userId)));

        if (!documentToDelete)
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Document not found",
          });

        const userDocuments = await tx
          .select({ id: documents.id, name: documents.name })
          .from(documents)
          .where(eq(documents.userId, userId));

        const isOnlyDocument = userDocuments.length === 1;

        await tx
          .delete(documents)
          .where(and(eq(documents.id, id), eq(documents.userId, userId)));

        if (isOnlyDocument) {
          const now = Date.now();

          const fallbackDocument = {
            id: crypto.randomUUID(),
            userId: userId,
            name: getNewDocumentName([]),
            content: "",
            order: 1,
            createdAt: now,
            modifiedAt: now,
          };
          await tx.insert(documents).values(fallbackDocument);

          return {
            deletedId: id,
            fallbackDocument,
          };
        }

        await tx
          .update(documents)
          .set({ order: sql`${documents.order} - 1` })
          .where(
            and(
              eq(documents.userId, userId),
              gt(documents.order, documentToDelete.order),
            ),
          );

        return {
          deletedId: id,
          fallbackDocument: null,
        };
      });

      return result;
    },
  }),
};
