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

export const guestDocumentSchema = z.object({
  name: z.string(),
  content: z.string(),
  createdAt: z.number(),
  modifiedAt: z.number(),
});

export const emailSchema = z.email();

export const otpSchema = z
  .string()
  .regex(/^[0-9]+$/, "Code must only contain numbers")
  .length(6, "The confirmation code must be 6 digits.");
