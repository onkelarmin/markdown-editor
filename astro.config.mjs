// @ts-check
import { defineConfig } from "astro/config";

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

  adapter: netlify(),

  output: "server",
});
