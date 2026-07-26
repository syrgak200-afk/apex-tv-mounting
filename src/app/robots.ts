import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    host: "https://www.apex-tv-mounting.com",
    sitemap: "https://www.apex-tv-mounting.com/sitemap.xml",
  };
}
