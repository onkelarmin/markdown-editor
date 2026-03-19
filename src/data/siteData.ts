export type PageKey = "home";

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
    title:
      "In-Browser Markdown Editor | Real-Time Preview & Document Management",
    description:
      "A responsive in-browser markdown editor with real-time preview, document management, and a scalable architecture. Create, edit, and organize markdown documents seamlessly.",
    ogImage: "og/home.webp",
  },
};
