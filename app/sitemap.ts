import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { deepDives } from "@/lib/content/deep-dives";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/deep-dives",
    ...deepDives.map((d) => `/deep-dives/${d.slug}`),
    "/system-design",
    "/resources",
  ];
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
