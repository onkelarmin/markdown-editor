// @ts-check
import { defineConfig } from "astro/config";

import db from "@astrojs/db";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  site: "https://fm-recipe-finder-website.netlify.app/",

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

  integrations: [db()],

  adapter: netlify(),

  output: "server",
});
