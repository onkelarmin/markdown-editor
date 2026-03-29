import { column, defineDb, defineTable } from "astro:db";

const Document = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text(),
    name: column.text({ unique: true }),
    content: column.text(),
    createdAt: column.number(),
    modifiedAt: column.number(),
  },
});

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    email: column.text(),
  },
});

export default defineDb({
  tables: { Document, User },
});
