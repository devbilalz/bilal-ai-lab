import { site } from "@/lib/site";

/**
 * JSON-LD Person schema (F6) - helps the site rank for "Bilal Zahid ..." queries.
 */
export function PersonJsonLd() {
  const sameAs = [site.links.github, site.links.linkedin].filter(Boolean);

  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.person,
    url: site.url,
    jobTitle: site.title,
    description: site.description,
    sameAs,
    knowsAbout: [
      "LLM Infrastructure",
      "Agentic AI",
      "RLHF",
      "SFT",
      "LLM Evaluation",
      "Distributed Systems",
      "Full-Stack Engineering",
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Static, trusted content - safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
