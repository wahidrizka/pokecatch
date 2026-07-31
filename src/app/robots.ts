import type { MetadataRoute } from "next";
import { SITE_URL } from "@/configs/site";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: "/my-pokemon",
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
	};
}
