/** The canonical origin: every canonical, og:url, sitemap entry and JSON-LD URL is built from it. */
export const SITE = 'https://www.alouaniyoussef.com';
/** SITE without the scheme, for printed text (CV, OG cards). */
export const SITE_HOST = new URL(SITE).host;
