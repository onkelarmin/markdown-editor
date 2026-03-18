export type PageKey = "home" | "about" | "recipes";

export interface PageData {
  key: PageKey;
  name: string;
  url: string;
  title: string;
  description: string;
  ogImage: string;
}

export const sitePages: Record<PageKey, PageData> = {
  home: {
    key: "home",
    name: "Home",
    url: "/",
    title: "Healthy meals, zero fuss - Healthy Recipe Finder",
    description:
      "Discover eight quick, whole-food recipes that you can cook tonight—no processed junk, no guesswork.",
    ogImage: "og/home.webp",
  },
  about: {
    key: "about",
    name: "About",
    url: "/about",
    title: "Our mission - Healthy Recipe Finder",
    description:
      "Healthy Recipe Finder exists to help more people cook nourishing meals more often, with quick whole-food recipes that are affordable, approachable, and genuinely delicious.",
    ogImage: "og/about.webp",
  },
  recipes: {
    key: "recipes",
    name: "Recipes",
    url: "/recipes",
    title: "Recipes - Healthy Recipe Finder",
    description:
      "Explore eight quick, whole-food recipes designed for real-life schedules. Search by name or ingredient, or scroll through and find something delicious to cook today.",
    ogImage: "og/recipes.webp",
  },
};
