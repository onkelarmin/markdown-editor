import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
  resolve: {
    alias: {
      "astro:actions": fileURLToPath(
        new URL(
          "./src/scripts/features/markdown/lib/test-utils.ts",
          import.meta.url,
        ),
      ),
    },
  },
});
