/**
 * The simulated real-world services behind the Generalized Agent APIs (Gemini
 * Gym). Categorized list transcribed from
 * `Turing Projects Overview/GEMINI_GYM_PROJECT_OVERVIEW.md` (Pillar 1).
 * ~77 services total; these are the named, representative ones.
 */
export interface ApiCategory {
  name: string;
  items: string[];
}

export const apiCatalog: ApiCategory[] = [
  {
    name: "Google Workspace",
    items: [
      "Gmail",
      "Calendar",
      "Docs",
      "Sheets",
      "Slides",
      "Drive",
      "Chat",
      "Meet",
      "Search",
      "Maps",
      "People",
    ],
  },
  {
    name: "Enterprise & Dev tools",
    items: [
      "Slack",
      "GitHub",
      "GitHub Actions",
      "Jira",
      "Confluence",
      "Salesforce",
      "Workday",
      "SAP Concur",
      "HubSpot",
      "Zendesk",
      "Azure",
      "BigQuery",
      "MongoDB",
      "MySQL",
      "Supabase",
    ],
  },
  {
    name: "Consumer & Social",
    items: [
      "WhatsApp",
      "Instagram",
      "LinkedIn",
      "TikTok",
      "Reddit",
      "Spotify",
      "YouTube",
    ],
  },
  {
    name: "Commerce",
    items: ["Shopify", "Stripe"],
  },
  {
    name: "Dev / IDE agents",
    items: ["Cursor", "Copilot", "Claude Code", "Gemini CLI", "Terminal", "Puppeteer"],
  },
  {
    name: "Device & system-level",
    items: [
      "Phone",
      "Clock",
      "Notifications",
      "Device Settings",
      "Google Home",
      "Media Control",
    ],
  },
];

export const apiCatalogTotal = 77;
export const apiCatalogNamed = apiCatalog.reduce(
  (n, c) => n + c.items.length,
  0,
);
