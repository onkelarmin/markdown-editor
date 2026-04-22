import { db } from "@/server/db/client";
import { and, eq, gt, sql } from "drizzle-orm";
import { documents } from "@/server/db/schema";
import { documentNameSchemaFull } from "@/scripts/features/markdown/schema";
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
    }),

    handler: async (
      { id, name, content, order, createdAt, modifiedAt },
      context,
    ) => {
      const user = context.locals.user;

      if (!user)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });

      await db.insert(documents).values({
        id,
        name,
        content,
        order,
        createdAt,
        modifiedAt,
        userId: user.id,
      });

      return { id };
    },
  }),

  getDocuments: defineAction({
    handler: async (_, context) => {
      const user = context.locals.user;

      if (!user)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });

      const rows = await db
        .select()
        .from(documents)
        .where(eq(documents.userId, user.id))
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
    }),

    handler: async ({ id, name, content, modifiedAt }, context) => {
      const user = context.locals.user;

      if (!user)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });

      await db
        .update(documents)
        .set({ name, content, modifiedAt })
        .where(and(eq(documents.id, id), eq(documents.userId, user.id)));

      return { id };
    },
  }),

  reorderDocuments: defineAction({
    input: z.object({
      reordered: z.array(
        z.object({
          id: z.string(),
          order: z.number(),
        }),
      ),
    }),

    handler: async ({ reordered }, context) => {
      const user = context.locals.user;

      if (!user)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });

      await db.transaction(async (tx) => {
        for (const document of reordered) {
          await tx
            .update(documents)
            .set({ order: document.order })
            .where(
              and(eq(documents.id, document.id), eq(documents.userId, user.id)),
            );
        }
      });
    },
  }),

  deleteDocument: defineAction({
    input: z.object({ id: z.string() }),

    handler: async ({ id }, context) => {
      const user = context.locals.user;

      if (!user)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });

      const result = await db.transaction(async (tx) => {
        const [documentToDelete] = await tx
          .select({ id: documents.id, order: documents.order })
          .from(documents)
          .where(and(eq(documents.id, id), eq(documents.userId, user.id)));

        if (!documentToDelete)
          throw new ActionError({
            code: "NOT_FOUND",
            message: "Document not found",
          });

        const userDocuments = await tx
          .select({ id: documents.id, name: documents.name })
          .from(documents)
          .where(eq(documents.userId, user.id));

        const isOnlyDocument = userDocuments.length === 1;

        await tx
          .delete(documents)
          .where(and(eq(documents.id, id), eq(documents.userId, user.id)));

        if (isOnlyDocument) {
          const now = Date.now();

          const fallbackDocument = {
            id: crypto.randomUUID(),
            userId: user.id,
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
              eq(documents.userId, user.id),
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
