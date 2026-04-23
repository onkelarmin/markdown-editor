// @ts-check
import { defineConfig, envField } from "astro/config";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "http://localhost:4321/",

  image: {
    responsiveStyles: true,
    layout: "constrained",
  },

  prefetch: {
    prefetchAll: true,
  },

  devToolbar: {
    enabled: false,
  },

  adapter: netlify(),

  output: "server",

  env: {
    schema: {
      TURSO_DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_AUTH_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      BETTER_AUTH_URL: envField.string({ context: "server", access: "secret" }),
      BETTER_AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
      AUTH_EMAIL_FROM: envField.string({ context: "server", access: "secret" }),
    },
  },
});
