import {
  integer,
  sqliteTable,
  text,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { user } from "./auth-schema";

export const documents = sqliteTable(
  "documents",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    content: text("content").notNull(),
    order: integer("order").notNull(),
    createdAt: integer("created_at").notNull(),
    modifiedAt: integer("modified_at").notNull(),
  },
  (table) => [
    index("documents_user_idx").on(table.userId),
    uniqueIndex("documents_user_order_unique").on(table.userId, table.order),
    uniqueIndex("documents_user_name_unique").on(table.userId, table.name),
  ],
);
