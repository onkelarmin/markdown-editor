import { z } from "astro/zod";

export const documentNameSchemaLight = z
  .string()
  .min(1, "Can't be empty")
  .max(50, "Name is too long")
  .regex(/^[^\\/:*?"<>|]+$/, 'Invalid chars: / \ : * ? " < > |');

export const documentNameSchemaFull = z
  .string()
  .min(1, "Can't be empty")
  .max(50, "Name is too long")
  .endsWith(".md", "File extension needs to be '.md'")
  .regex(/^[^\\/:*?"<>|]+$/, 'Invalid chars: / \ : * ? " < > |')
  .regex(/^.+\.md$/, "Must have a valid name before file extension");
