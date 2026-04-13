import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const documents = sqliteTable("documents", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull().unique(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  createdAt: integer("created_at").notNull(),
  modifiedAt: integer("modified_at").notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
});
