import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://apex-tv-mounting.vercel.app",
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  }];
}
