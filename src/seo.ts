import { useEffect } from "react";

const SITE_NAME = "Sk8r Punk™";
const SITE_URL = "https://sk8rpunk.com";
const DEFAULT_IMAGE_PATH = "/Skateboards%20in%20space.png";
const DEFAULT_IMAGE_URL = `${SITE_URL}${DEFAULT_IMAGE_PATH}`;
const HOME_TITLE = "Sk8r Punk™ — Electric Skateboard Cyberpunk Universe | Play Punch Skater™";
const HOME_DESCRIPTION =
  "Sk8r Punk™ is an electric skateboard cyberpunk universe. Explore the lore, factions, riders, and projects, then play Punch Skater™ — the first live game.";

type SeoDefinition = {
  title: string;
  description: string;
  canonical: string;
  robots: string;
  ogType: "website" | "article";
  image: string;
  structuredData?: Record<string, unknown>;
};

function getHomeStructuredData(punchskaterUrl: string): Record<string, unknown> {
  const projects = [
    {
      name: "Punch Skater™",
      description:
        "The first live game in the Sk8r Punk™ universe. Build an electric-skateboard crew, forge cards, run missions, and compete.",
      type: "VideoGame",
      url: punchskaterUrl,
    },
    {
      name: "Courier Dispatch",
      description:
        "A squad-based delivery game set across the neon districts of cyberpunk Australia.",
      type: "CreativeWork",
    },
    {
      name: "Sk8r Joust",
      description:
        "Electric-skate jousting combat featuring shock lances, crafted gear, and tournaments.",
      type: "CreativeWork",
    },
    {
      name: "Neon Dice",
      description:
        "A faction-driven dice and wagering game set inside the Sk8r Punk™ universe.",
      type: "Game",
    },
    {
      name: "Fiction & Novels",
      description:
        "Lore and fiction releases, including Operation Nightshade.",
      type: "CreativeWorkSeries",
    },
    {
      name: "Codex",
      description:
        "The canon guide to factions, districts, board tech, and lore across the universe.",
      type: "CreativeWork",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/favicon.svg`,
        description: HOME_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        description: HOME_DESCRIPTION,
        inLanguage: "en",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/#webpage`,
        name: HOME_TITLE,
        url: `${SITE_URL}/`,
        description: HOME_DESCRIPTION,
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        about: [
          { "@type": "Thing", name: "electric skateboard cyberpunk" },
          { "@type": "Thing", name: "Punch Skater™" },
          { "@type": "Thing", name: "cyberpunk Australia" },
        ],
        mainEntity: {
          "@type": "ItemList",
          name: "Sk8r Punk™ universe projects",
          itemListElement: projects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": project.type,
              name: project.name,
              description: project.description,
              ...(project.url ? { url: project.url } : {}),
            },
          })),
        },
      },
    ],
  };
}

export function getSeoDefinition(page: string | null, punchskaterUrl: string): SeoDefinition {
  if (page === "bios") {
    return {
      title: "Character Bios | Sk8r Punk™",
      description:
        "Character bios for the riders and operatives of the Sk8r Punk™ universe. This section is access-restricted and not intended for search indexing.",
      canonical: `${SITE_URL}/?page=bios`,
      robots: "noindex, nofollow, noarchive",
      ogType: "article",
      image: DEFAULT_IMAGE_URL,
    };
  }

  if (page === "joustur-skatur") {
    return {
      title: "Joustur Skatur™ | Sk8r Punk™",
      description:
        "Joustur Skatur™ is an upcoming Punch Skater™ mode inside the Sk8r Punk™ universe.",
      canonical: `${SITE_URL}/?page=joustur-skatur`,
      robots: "noindex, nofollow, noarchive",
      ogType: "website",
      image: DEFAULT_IMAGE_URL,
    };
  }

  return {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    ogType: "website",
    image: DEFAULT_IMAGE_URL,
    structuredData: getHomeStructuredData(punchskaterUrl),
  };
}

function upsertMeta(
  selector: string,
  attributes: Record<string, string>,
  content: string,
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
}

function removeElement(selector: string) {
  document.head.querySelector(selector)?.remove();
}

export function useSeo(page: string | null, punchskaterUrl: string) {
  useEffect(() => {
    const seo = getSeoDefinition(page, punchskaterUrl);

    document.title = seo.title;
    document.documentElement.lang = "en";

    upsertMeta('meta[name="description"]', { name: "description" }, seo.description);
    upsertMeta('meta[name="robots"]', { name: "robots" }, seo.robots);
    upsertMeta('meta[property="og:type"]', { property: "og:type" }, seo.ogType);
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
    upsertMeta('meta[property="og:url"]', { property: "og:url" }, seo.canonical);
    upsertMeta('meta[property="og:title"]', { property: "og:title" }, seo.title);
    upsertMeta('meta[property="og:description"]', { property: "og:description" }, seo.description);
    upsertMeta('meta[property="og:image"]', { property: "og:image" }, seo.image);
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, seo.description);
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, seo.image);

    upsertLink('link[rel="canonical"]', { rel: "canonical", href: seo.canonical });

    if (seo.structuredData) {
      let script = document.head.querySelector<HTMLScriptElement>('script[data-seo="json-ld"]');
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "json-ld");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(seo.structuredData);
    } else {
      removeElement('script[data-seo="json-ld"]');
    }
  }, [page, punchskaterUrl]);
}
