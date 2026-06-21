import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
import { getProducts } from "@/server/services/product.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE.url}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE.url}/register`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const { products } = await getProducts({ perPage: 100 });
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE.url}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
